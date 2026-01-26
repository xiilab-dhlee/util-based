"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Icon, Modal, TextArea } from "xiilab-ui";

import {
  getGetUsageRequestListQueryKey,
  useRejectUsageRequest,
} from "@/api/generated/admin-image-tag-usage-request/admin-image-tag-usage-request";
import {
  type RejectRequestImageFormType,
  rejectRequestImageSchema,
} from "@/domain/request-image/schemas/reject-request-image.schema";
import { REQUEST_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { LastFormItem } from "@/styles/layers/form-layer.styled";
import { ModalDescription } from "@/styles/layers/modal-layers.styled";

interface RejectRequestImagePayload {
  usageRequestId: number;
}

export function RejectRequestImageModal() {
  const [open, setOpen] = useState(false);
  const [usageRequestId, setUsageRequestId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectRequestImageFormType>({
    resolver: zodResolver(rejectRequestImageSchema),
    mode: "onChange",
    defaultValues: {
      rejectReason: "",
    },
  });

  const { mutate, isPending } = useRejectUsageRequest();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: RejectRequestImageFormType) => {
    if (isPending) return;
    if (usageRequestId === null) return;

    mutate(
      {
        usageRequestId,
        data: {
          rejectReason: data.rejectReason,
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

  useSubscribe<RejectRequestImagePayload>(
    REQUEST_IMAGE_EVENTS.openRejectModal,
    (payload) => {
      setUsageRequestId(payload.usageRequestId);
      reset();
      setOpen(true);
    },
  );

  return (
    <Modal
      type="danger"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      title="이미지 사용 반려"
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
        사용자가 제출한 이미지 사용 요청이 반려될 경우, 해당 이미지는 사용이
        제한됩니다. 이때 관리자는 반려 사유를 반드시 입력해야 합니다.
      </ModalDescription>
      <Form onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="rejectReason"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="반려 사유"
              required
              htmlFor="rejectReason"
              validateStatus={errors.rejectReason ? "error" : undefined}
              help={errors.rejectReason?.message}
            >
              <TextArea
                {...field}
                id="rejectReason"
                placeholder="이미지 사용 요청 반려 사유를 입력해 주세요."
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
