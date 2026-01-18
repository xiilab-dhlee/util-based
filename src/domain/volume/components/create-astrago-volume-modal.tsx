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
  useRegisterAstragoVolume,
} from "@/api/generated/volume/volume";
import { VOLUME_VISIBILITY_OPTIONS } from "@/domain/volume/constants/volume.constant";
import {
  type CreateAstragoVolumeFormType,
  createAstragoVolumeSchema,
} from "@/domain/volume/schemas/volume.schema";
import { openCreateAstragoVolumeModalAtom } from "@/domain/volume/state/volume.atom";
import { StorageSelect } from "@/shared/components/select/storage-select";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

/**
 * AstraGo 볼륨 생성 모달 컴포넌트
 *
 * 사용자가 AstraGo Storage를 사용하여 새로운 볼륨을 생성할 수 있는 모달입니다.
 * 볼륨 이름 입력, 마운트 경로 설정, 파일 업로드 기능을 제공합니다.
 * 볼륨 생성 성공 시 pubsub을 통해 다른 컴포넌트에 알림을 전달합니다.
 *
 * @returns AstraGo 볼륨 생성 모달 JSX 요소
 */
export function CreateAstragoVolumeModal() {
  const queryClient = useQueryClient();

  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openCreateAstragoVolumeModalAtom,
  );

  // 볼륨 생성 Hook 사용 (orval 생성)
  const registerAstragoVolume = useRegisterAstragoVolume();

  // react-hook-form 설정
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAstragoVolumeFormType>({
    resolver: zodResolver(createAstragoVolumeSchema),
    defaultValues: {
      volumeName: "",
      isPublic: "true",
      mountPath: "",
      storageId: "",
    },
  });

  /**
   * 모달 취소 핸들러
   *
   * 현재 모달을 닫습니다.
   */
  const handleCancel = () => {
    if (registerAstragoVolume.isPending) return;
    onClose();
  };

  /**
   * 볼륨 생성 제출 핸들러
   *
   * 폼 데이터를 수집하여 볼륨 생성 API를 호출합니다.
   * 성공 시 성공 메시지를 표시하고 모달을 닫습니다.
   */
  const onSubmit = (data: CreateAstragoVolumeFormType) => {
    registerAstragoVolume.mutate(
      {
        data: {
          volumeName: data.volumeName,
          isPublic: data.isPublic === "true",
          mountPath: data.mountPath,
          storageId: Number(data.storageId),
          workspaceId: selectedWorkspace?.workspaceId,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetVolumeListQueryKey(),
          });
          toast.success("볼륨 생성 성공");
          onClose();
        },
      },
    );
  };

  useSubscribe(VOLUME_EVENTS.sendStorageType, (eventData: string) => {
    if (eventData === "ASTRAGO") {
      onOpen();
    }
  });

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Astrago" color="#fff" size={16} />}
      open={open}
      closable
      title="AstraGo Storage"
      showCancelButton
      onCancel={handleCancel}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      okButtonProps={{
        disabled: registerAstragoVolume.isPending,
      }}
      cancelButtonProps={{
        disabled: registerAstragoVolume.isPending,
      }}
      afterClose={reset}
    >
      {/* 볼륨 생성 폼 */}
      <StyledForm>
        {/* 스토리지 선택 */}
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
                disabled={registerAstragoVolume.isPending}
              />
            </FormItem>
          )}
        />

        {/* 볼륨 이름 입력 */}
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
                disabled={registerAstragoVolume.isPending}
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
                disabled={registerAstragoVolume.isPending}
              />
            </FormItem>
          )}
        />

        {/* 마운트 경로 입력 필드 */}
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
                disabled={registerAstragoVolume.isPending}
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
