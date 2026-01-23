"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Form, Icon, Modal, TextArea } from "xiilab-ui";

import { useCreateUsageRequest } from "@/api/generated/image-tag-usage-request/image-tag-usage-request";
import type { RequestUsePayload } from "@/domain/registry/components/detail/request-use-button";
import {
  type RequestUseTagFormType,
  requestUseTagSchema,
} from "@/domain/registry/schemas/request-use-tag.schema";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

export function RequestUseModal() {
  const [open, setOpen] = useState(false);
  const [imageTagId, setImageTagId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestUseTagFormType>({
    resolver: zodResolver(requestUseTagSchema),
    mode: "onChange",
    defaultValues: {
      requestReason: "",
    },
  });

  const { mutate, isPending } = useCreateUsageRequest();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: RequestUseTagFormType) => {
    if (isPending) return;
    if (imageTagId === null) return;

    mutate(
      {
        data: {
          imageTagId: [imageTagId],
          requestReason: data.requestReason,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<RequestUsePayload>(
    REGISTRY_EVENTS.openRequestUseModal,
    (payload) => {
      setImageTagId(payload.imageTagId);
      reset({
        requestReason: "",
      });
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="RequestResource" color="#fff" size={18} />}
      modalWidth={400}
      open={open}
      title="이미지 사용 요청"
      showCancelButton
      onCancel={handleCancel}
      okText="요청"
      cancelText="취소"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        disabled: isPending,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <Form onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="requestReason"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="사용 요청 사유"
              required
              htmlFor="registryTagRequestReason"
              validateStatus={errors.requestReason ? "error" : undefined}
              help={errors.requestReason?.message}
            >
              <TextArea
                {...field}
                id="registryTagRequestReason"
                placeholder="사용 요청 사유를 입력해 주세요."
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
