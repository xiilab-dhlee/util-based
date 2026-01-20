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
  useRegisterOnPremiseVolume,
} from "@/api/generated/volume/volume";
import { VOLUME_VISIBILITY_OPTIONS } from "@/domain/volume/constants/volume.constant";
import {
  type CreateOnPremiseVolumeFormType,
  createOnPremiseVolumeSchema,
} from "@/domain/volume/schemas/volume.schema";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

export function CreateOnPremVolumeModal() {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const [open, setOpen] = useState(false);
  const registerOnPremiseVolume = useRegisterOnPremiseVolume();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOnPremiseVolumeFormType>({
    resolver: zodResolver(createOnPremiseVolumeSchema),
  });

  const handleCancel = () => {
    if (registerOnPremiseVolume.isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: CreateOnPremiseVolumeFormType) => {
    if (registerOnPremiseVolume.isPending) return;
    if (!selectedWorkspace) return;

    registerOnPremiseVolume.mutate(
      {
        data: {
          volumeName: data.volumeName,
          isPublic: data.isPublic === "true",
          mountPath: data.mountPath,
          serverIp: data.serverIp,
          volumePath: data.volumePath,
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

  useSubscribe(VOLUME_EVENTS.openCreateOnPremModal, () => {
    reset({
      volumeName: "",
      isPublic: "true",
      mountPath: "",
      serverIp: "",
      volumePath: "",
    });
    setOpen(true);
  });

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="OnPremiseStorage" color="#fff" size={16} />}
      open={open}
      closable
      title="On-premise Storage"
      showCancelButton
      onCancel={handleCancel}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      okButtonProps={{ loading: registerOnPremiseVolume.isPending }}
      cancelButtonProps={{ disabled: registerOnPremiseVolume.isPending }}
    >
      <StyledForm>
        <Controller
          name="volumeName"
          control={control}
          render={({ field }) => (
            <FormItem
              label="볼륨 이름"
              required
              validateStatus={errors.volumeName ? "error" : undefined}
              htmlFor="onpremVolumeName"
              help={errors.volumeName?.message}
            >
              <Input
                {...field}
                type="text"
                id="onpremVolumeName"
                placeholder="볼륨 이름을 입력해 주세요."
                width="100%"
                autoComplete="off"
                disabled={registerOnPremiseVolume.isPending}
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
                value={field.value || null}
                onChange={(value) => field.onChange(value)}
                width="100%"
                status={errors.isPublic ? "error" : undefined}
                disabled={registerOnPremiseVolume.isPending}
              />
            </FormItem>
          )}
        />
        <Controller
          name="serverIp"
          control={control}
          render={({ field }) => (
            <FormItem
              label="Server IP"
              required
              validateStatus={errors.serverIp ? "error" : undefined}
              htmlFor="onpremVolumeServerIp"
              help={errors.serverIp?.message}
            >
              <Input
                {...field}
                type="text"
                id="onpremVolumeServerIp"
                placeholder="Server IP를 입력해 주세요."
                width="100%"
                autoComplete="off"
                disabled={registerOnPremiseVolume.isPending}
                maxLength={50}
              />
            </FormItem>
          )}
        />
        <Controller
          name="volumePath"
          control={control}
          render={({ field }) => (
            <FormItem
              label="Server Path"
              required
              validateStatus={errors.volumePath ? "error" : undefined}
              htmlFor="onpremVolumePath"
              help={errors.volumePath?.message}
            >
              <Input
                {...field}
                type="text"
                id="onpremVolumePath"
                placeholder="Server Path를 입력해 주세요."
                width="100%"
                autoComplete="off"
                disabled={registerOnPremiseVolume.isPending}
                maxLength={1000}
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
              htmlFor="onpremVolumeMountPath"
              help={errors.mountPath?.message}
            >
              <Input
                {...field}
                type="text"
                id="onpremVolumeMountPath"
                placeholder="/usr/local"
                width="100%"
                autoComplete="off"
                disabled={registerOnPremiseVolume.isPending}
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
