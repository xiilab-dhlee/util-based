"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Dropdown, Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import {
  getGetVolumeListQueryKey,
  useRegisterAstragoVolume,
} from "@/api/generated/volume/volume";
import { VOLUME_VISIBILITY_OPTIONS } from "@/domain/volume/constants/volume.constant";
import {
  type CreateAstragoVolumeFormType,
  createAstragoVolumeSchema,
} from "@/domain/volume/schemas/volume.schema";
import { StorageSelect } from "@/shared/components/select/storage-select";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

export function CreateAstragoVolumeModal() {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useRegisterAstragoVolume();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAstragoVolumeFormType>({
    resolver: zodResolver(createAstragoVolumeSchema),
    defaultValues: {
      volumeName: "",
      isPublic: true,
      mountPath: "",
    },
  });

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: CreateAstragoVolumeFormType) => {
    if (isPending) return;
    if (!selectedWorkspace) return;

    mutate(
      {
        data: {
          volumeName: data.volumeName,
          isPublic: data.isPublic,
          mountPath: data.mountPath,
          storageId: data.storageId,
          workspaceId: selectedWorkspace.workspaceId,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetVolumeListQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  useSubscribe(VOLUME_EVENTS.openCreateAstragoModal, () => {
    reset();
    setOpen(true);
  });

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Astrago" color="#fff" size={16} />}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="AstraGo Storage"
      showCancelButton
      onCancel={handleCancel}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <StyledForm>
        <Controller
          name="storageId"
          control={control}
          render={({ field }) => (
            <FormItem
              label="스토리지 목록"
              required
              validateStatus={errors.storageId ? "error" : undefined}
              help={errors.storageId?.message}
            >
              <StorageSelect
                value={field.value || null}
                onChange={(value) => field.onChange(value)}
                width="100%"
                status={errors.storageId ? "error" : undefined}
                disabled={isPending}
              />
            </FormItem>
          )}
        />
        <Controller
          name="volumeName"
          control={control}
          render={({ field }) => (
            <FormItem
              label="볼륨 이름"
              required
              validateStatus={errors.volumeName ? "error" : undefined}
              htmlFor="astragoVolumeName"
              help={errors.volumeName?.message}
            >
              <Input
                {...field}
                type="text"
                id="astragoVolumeName"
                placeholder="볼륨 이름을 입력해 주세요."
                width="100%"
                autoComplete="off"
                disabled={isPending}
                maxLength={50}
              />
            </FormItem>
          )}
        />
        <Controller
          name="isPublic"
          control={control}
          render={({ field }) => (
            <FormItem
              label="공개 설정"
              required
              validateStatus={errors.isPublic ? "error" : undefined}
              help={errors.isPublic?.message}
            >
              <Dropdown
                options={VOLUME_VISIBILITY_OPTIONS}
                value={field.value ? "true" : "false"}
                onChange={(value) => field.onChange(value === "true")}
                width="100%"
                status={errors.isPublic ? "error" : undefined}
                disabled={isPending}
              />
            </FormItem>
          )}
        />
        <Controller
          name="mountPath"
          control={control}
          render={({ field }) => (
            <FormItem
              label="Mount Path"
              required
              validateStatus={errors.mountPath ? "error" : undefined}
              htmlFor="astragoVolumeMountPath"
              help={errors.mountPath?.message}
            >
              <Input
                {...field}
                type="text"
                id="astragoVolumeMountPath"
                placeholder="/usr/local"
                width="100%"
                autoComplete="off"
                disabled={isPending}
                maxLength={1000}
              />
            </FormItem>
          )}
        />
      </StyledForm>
    </Modal>
  );
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
