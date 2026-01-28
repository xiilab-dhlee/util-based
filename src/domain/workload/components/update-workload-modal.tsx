"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, FormItem, Icon, Input, Modal, TextArea } from "xiilab-ui";

import {
  getGetWorkloadDetailQueryKey,
  useUpdateWorkload,
} from "@/api/generated/workload/workload";
import {
  type UpdateWorkloadFormType,
  updateWorkloadSchema,
} from "@/domain/workload/schemas/workload.schema";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

/** 이벤트 페이로드 타입 */
interface UpdateWorkloadPayload {
  workloadResourceName: string;
  workspaceId: number;
  workloadName: string;
  description?: string;
}

/**
 * 워크로드 수정 모달 컴포넌트
 *
 * 워크로드의 이름과 설명을 수정할 수 있는 모달입니다.
 * 워크로드 상세 페이지에서 사용됩니다.
 */
export function UpdateWorkloadModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [workloadResourceName, setWorkloadResourceName] = useState<
    string | null
  >(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateWorkloadFormType>({
    resolver: zodResolver(updateWorkloadSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useUpdateWorkload();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: UpdateWorkloadFormType) => {
    if (isPending) return;
    if (workloadResourceName === null || workspaceId === null) return;

    mutate(
      {
        workspaceId,
        workloadResourceName,
        data: {
          workloadName: data.workloadName,
          description: data.description,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetWorkloadDetailQueryKey(
              workspaceId,
              workloadResourceName,
            ),
          });
          setOpen(false);
        },
      },
    );
  };

  // 모달 열기 이벤트 구독
  useSubscribe<UpdateWorkloadPayload>(
    WORKLOAD_EVENTS.openUpdateModal,
    (payload) => {
      setWorkloadResourceName(payload.workloadResourceName);
      setWorkspaceId(payload.workspaceId);
      reset({
        workloadName: payload.workloadName || "",
        description: payload.description || "",
      });
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="워크로드 정보 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="수정 완료"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: workloadResourceName === null || workspaceId === null,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <Form onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="workloadName"
          control={control}
          render={({ field }) => (
            <FormItem
              label="이름"
              htmlFor="updateWorkloadName"
              validateStatus={errors.workloadName ? "error" : undefined}
              help={errors.workloadName?.message}
              required
            >
              <Input
                {...field}
                type="text"
                id="updateWorkloadName"
                data-testid={WORKLOAD_SELECTOR.UPDATE_NAME_INPUT}
                placeholder="이름을 입력해 주세요."
                width="100%"
              />
            </FormItem>
          )}
        />

        {/* 워크로드 설명 입력 필드 */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="설명"
              htmlFor="updateWorkloadDescription"
              validateStatus={errors.description ? "error" : undefined}
              help={errors.description?.message}
            >
              <TextArea
                {...field}
                id="updateWorkloadDescription"
                data-testid={WORKLOAD_SELECTOR.UPDATE_DESCRIPTION_INPUT}
                placeholder="설명을 입력해 주세요."
              />
            </LastFormItem>
          )}
        />
      </Form>
    </Modal>
  );
}
