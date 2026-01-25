"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, Icon, Modal, TextArea } from "xiilab-ui";

import { useCreateUsageRequest } from "@/api/generated/image-tag-usage-request/image-tag-usage-request";
import type { RequestUsePayload } from "@/domain/registry/components/detail/request-use-button";
import {
  type RequestUseTagFormType,
  requestUseTagSchema,
} from "@/domain/registry/schemas/request-use-tag.schema";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

export function RequestUseModal() {
  const [open, setOpen] = useState(false);
  const [imageTagId, setImageTagId] = useState<number | null>(null);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

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
    if (!selectedWorkspace) return;

    mutate(
      {
        data: {
          imageTagId: [imageTagId],
          requestReason: data.requestReason,
          workspaceId: selectedWorkspace.workspaceId,
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
      okText="사용 요청"
      cancelText="취소"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        disabled: isPending || !selectedWorkspace,
        loading: isPending,
        title: !selectedWorkspace ? "워크스페이스를 선택해 주세요." : undefined,
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
              label={
                <GuideTooltipWrapper>
                  요청 사유
                  <GuideTooltip
                    maxWidth={240}
                    title="요청사항은 관리자에게 전달됩니다. 관리자가 이미지를
                        승인한 후 해당 이미지를 사용하실 수 있습니다."
                  />
                </GuideTooltipWrapper>
              }
              required
              htmlFor="registryTagRequestReason"
              validateStatus={errors.requestReason ? "error" : undefined}
              help={errors.requestReason?.message}
            >
              <TextArea
                {...field}
                id="registryTagRequestReason"
                placeholder="요청 사유를 입력해 주세요."
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

const GuideTooltipWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;
