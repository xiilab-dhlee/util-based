"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Icon, Modal, TextArea } from "xiilab-ui";

import {
  getGetUsageRequestListQueryKey,
  useApproveUsageRequest,
} from "@/api/generated/admin-image-tag-usage-request/admin-image-tag-usage-request";
import {
  type ApproveRequestImageFormType,
  approveRequestImageSchema,
} from "@/domain/request-image/schemas/approve-request-image.schema";
import { REQUEST_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { LastFormItem } from "@/styles/layers/form-layer.styled";
import { ModalDescription } from "@/styles/layers/modal-layers.styled";

interface ApproveRequestImagePayload {
  usageRequestId: number;
}

export function ApproveRequestImageModal() {
  const [open, setOpen] = useState(false);
  const [usageRequestId, setUsageRequestId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApproveRequestImageFormType>({
    resolver: zodResolver(approveRequestImageSchema),
    mode: "onChange",
    defaultValues: {
      approvalReason: "",
    },
  });

  const { mutate, isPending } = useApproveUsageRequest();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: ApproveRequestImageFormType) => {
    if (isPending) return;
    if (usageRequestId === null) return;

    mutate(
      {
        usageRequestId,
        data: {
          approvalReason: data.approvalReason || undefined,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetUsageRequestListQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<ApproveRequestImagePayload>(
    REQUEST_IMAGE_EVENTS.openApproveModal,
    (payload) => {
      setUsageRequestId(payload.usageRequestId);
      reset();
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      title="이미지 사용 승인"
      showCancelButton
      onCancel={handleCancel}
      okText="확인"
      cancelText="취소"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <ModalDescription>
        사용자가 제출한 이미지 사용 요청을 승인할 경우, 해당 이미지를 사용할 수
        있습니다. 이때 관리자는 승인 사유를 입력할 수 있습니다.
      </ModalDescription>
      <Form onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="approvalReason"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="승인 사유"
              htmlFor="approvalReason"
              validateStatus={errors.approvalReason ? "error" : undefined}
              help={errors.approvalReason?.message}
            >
              <TextArea
                {...field}
                id="approvalReason"
                placeholder="이미지 사용 요청 승인 사유를 입력해 주세요."
                width="100%"
                rows={4}
              />
            </LastFormItem>
          )}
        />
      </Form>
    </Modal>
  );
}
