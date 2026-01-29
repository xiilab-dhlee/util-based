"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import type {
  SnapshotEnvRequest,
  SnapshotPortRequest,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useCreatePrivateSnapshotImage } from "@/api/generated/private-registry/private-registry";
import {
  type CreateDirectSnapshotImageFormType,
  createDirectSnapshotImageSchema,
} from "@/domain/workload/schemas/create-direct-snapshot-image.schema";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

/**
 * Direct Snapshot Image 생성 모달에 전달되는 데이터 타입
 */
interface DirectSnapshotImagePayload {
  workloadId: number;
  workspaceId: number;
  env: SnapshotEnvRequest[] | null;
  port: SnapshotPortRequest[] | null;
}

/**
 * Direct Snapshot Image 생성 모달 컴포넌트
 *
 * 워크로드의 현재 상태를 기반으로 Docker 이미지를 생성할 수 있는 모달입니다.
 * react-hook-form을 사용하여 폼 상태를 관리하고, 개인 이미지 스냅샷 API를 호출합니다.
 */
export function CreateDirectSnapshotImageModal() {
  // 모달 상태 관리
  const [open, setOpen] = useState(false);

  // subscription으로 전달받는 데이터 상태
  const [workloadId, setWorkloadId] = useState<number | null>(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [env, setEnv] = useState<SnapshotEnvRequest[] | null>(null);
  const [port, setPort] = useState<SnapshotPortRequest[] | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDirectSnapshotImageFormType>({
    resolver: zodResolver(createDirectSnapshotImageSchema),
    mode: "onChange",
    defaultValues: {
      imageName: "",
      imageTagName: "",
    },
  });

  const { mutate, isPending } = useCreatePrivateSnapshotImage();

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: CreateDirectSnapshotImageFormType) => {
    if (isPending) return;
    if (workloadId === null || workspaceId === null) return;

    mutate(
      {
        data: {
          workloadId: workloadId ?? undefined,
          workspaceId: workspaceId ?? undefined,
          imageName: data.imageName,
          imageTagName: data.imageTagName,
          env: env ?? undefined,
          port: port ?? undefined,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  /**
   * Direct Snapshot Image 생성 모달 데이터 구독
   */
  useSubscribe(
    WORKLOAD_EVENTS.sendCommitImage,
    (eventData: DirectSnapshotImagePayload) => {
      // 전달받은 데이터 설정
      setWorkloadId(eventData.workloadId);
      setWorkspaceId(eventData.workspaceId);
      setEnv(eventData.env);
      setPort(eventData.port);
      reset();
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      title="Snapshot Image 생성"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        disabled: workloadId === null || workspaceId === null,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <Form onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="imageName"
          control={control}
          render={({ field }) => (
            <FormItem
              label="컨테이너 이미지 이름"
              required
              validateStatus={errors.imageName ? "error" : undefined}
              htmlFor="snapshotImageName"
              help={errors.imageName?.message}
            >
              <Input
                {...field}
                type="text"
                id="snapshotImageName"
                data-testid={WORKLOAD_SELECTOR.COMMIT_IMAGE_NAME_INPUT}
                placeholder="컨테이너 이미지 이름을 입력해 주세요."
                autoComplete="off"
                width="100%"
              />
            </FormItem>
          )}
        />
        <Controller
          name="imageTagName"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="태그"
              required
              validateStatus={errors.imageTagName ? "error" : undefined}
              htmlFor="snapshotImageTag"
              help={errors.imageTagName?.message}
            >
              <Input
                {...field}
                type="text"
                id="snapshotImageTag"
                data-testid={WORKLOAD_SELECTOR.COMMIT_IMAGE_TAG_INPUT}
                placeholder="태그를 입력해 주세요."
                autoComplete="off"
                width="100%"
              />
            </LastFormItem>
          )}
        />
      </Form>
    </Modal>
  );
}
