"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Dropdown, Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import {
  getGetVolumeListQueryKey,
  useRegisterOnPremiseVolume,
} from "@/api/generated/volume/volume";
import type { VolumeStorageType } from "@/domain/volume/schemas/volume.schema";
import {
  type CreateOnPremiseVolumeFormType,
  createOnPremiseVolumeSchema,
} from "@/domain/volume/schemas/volume.schema";
import { openCreateOnPremiseVolumeModalAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { VOLUME_VISIBILITY_OPTIONS } from "../constants/volume.constant";

/**
 * On-Premise 볼륨 생성 모달 컴포넌트
 *
 * 사용자가 On-Premise Storage를 사용하여 새로운 볼륨을 생성할 수 있는 모달입니다.
 * 볼륨 이름, 공개 설정, Server IP, Volume Path, Mount Path 입력 기능을 제공합니다.
 * 볼륨 생성 성공 시 pubsub을 통해 다른 컴포넌트에 알림을 전달합니다.
 *
 * @returns On-Premise 볼륨 생성 모달 JSX 요소
 */
export function CreateOnPremVolumeModal() {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openCreateOnPremiseVolumeModalAtom,
  );

  // 볼륨 생성 Hook 사용 (orval 생성)
  const registerOnPremiseVolume = useRegisterOnPremiseVolume();

  // react-hook-form 설정
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateOnPremiseVolumeFormType>({
    resolver: zodResolver(createOnPremiseVolumeSchema),
    defaultValues: {
      volumeName: "",
      isPublic: "true",
      mountPath: "",
      serverIp: "",
      volumePath: "",
    },
  });

  /**
   * 모달 취소 핸들러
   *
   * isPending 상태가 아닐 때만 모달을 닫습니다.
   */
  const handleCancel = () => {
    if (registerOnPremiseVolume.isPending) return;
    onClose();
  };

  /**
   * 볼륨 생성 제출 핸들러
   *
   * 폼 데이터를 수집하여 볼륨 생성 API를 호출합니다.
   * 성공 시 성공 메시지를 표시하고 모달을 닫습니다.
   */
  const onSubmit = (data: CreateOnPremiseVolumeFormType) => {
    registerOnPremiseVolume.mutate(
      {
        data: {
          volumeName: data.volumeName,
          isPublic: data.isPublic === "true",
          mountPath: data.mountPath,
          serverIp: data.serverIp,
          volumePath: data.volumePath,
          workspaceId: selectedWorkspace?.workspaceId,
        },
      },
      {
        onSuccess: () => {
          toast.success("볼륨 생성 성공");
          onClose();
          queryClient.invalidateQueries({
            queryKey: getGetVolumeListQueryKey(),
          });
        },
      },
    );
  };

  useSubscribe(
    VOLUME_EVENTS.sendStorageType,
    (eventData: VolumeStorageType) => {
      if (eventData === "LOCAL") {
        onOpen();
      }
    },
  );

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
      okButtonProps={{
        loading: registerOnPremiseVolume.isPending,
      }}
      cancelButtonProps={{
        disabled: registerOnPremiseVolume.isPending,
      }}
      afterClose={reset}
    >
      {/* 볼륨 생성 폼 */}
      <StyledForm>
        {/* 볼륨 이름 입력 */}
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

        {/* 공개 설정 드롭다운 */}
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

        {/* Server IP 입력 필드 */}
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

        {/* Volume Path 입력 필드 */}
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

        {/* Mount Path 입력 필드 */}
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
