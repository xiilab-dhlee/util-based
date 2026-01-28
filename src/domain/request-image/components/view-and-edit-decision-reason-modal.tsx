"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, Icon, Modal, TextArea, Typography } from "xiilab-ui";

import {
  getGetUsageRequestListQueryKey,
  useUpdateDecisionReason,
} from "@/api/generated/admin-image-tag-usage-request/admin-image-tag-usage-request";
import type { ImageTagUsageRequestResponseApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type UpdateDecisionReasonFormType,
  updateDecisionReasonSchema,
} from "@/domain/request-image/schemas/update-decision-reason.schema";
import { REQUEST_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import {
  checkIsSuperAdmin,
  getSessionAccountId,
} from "@/shared/utils/auth.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { LastFormItem } from "@/styles/layers/form-layer.styled";

type ModalMode = "view" | "edit";

interface ViewAndEditDecisionReasonPayload {
  usageRequestId: number;
  decisionReason?: string;
  approvalStatus: ImageTagUsageRequestResponseApprovalStatus;
  deciderName?: string;
  deciderId?: string;
  decidedAt?: string;
}

export function ViewAndEditDecisionReasonModal() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("view");
  const [payload, setPayload] =
    useState<ViewAndEditDecisionReasonPayload | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateDecisionReasonFormType>({
    resolver: zodResolver(updateDecisionReasonSchema),
    mode: "onChange",
    defaultValues: {
      decisionReason: "",
    },
  });

  const { mutate, isPending } = useUpdateDecisionReason();

  // 권한 체크: 결정자 본인 또는 슈퍼 관리자만 수정 가능
  const sessionAccountId = getSessionAccountId(session);
  const isSuperAdmin = checkIsSuperAdmin(session);
  const isDecider = payload?.deciderId === sessionAccountId;
  const canEdit = !!session && (isDecider || isSuperAdmin);

  const isApproved = payload?.approvalStatus === "APPROVED";
  const statusLabel = isApproved ? "승인" : "반려";

  const resetModalState = () => {
    if (isPending) return;
    setOpen(false);
    setMode("view");
    setPayload(null);
  };

  const handleEditClick = () => {
    if (payload) {
      reset({ decisionReason: payload.decisionReason || "" });
      setMode("edit");
    }
  };

  const onSubmit = (data: UpdateDecisionReasonFormType) => {
    if (isPending || !payload) return;

    mutate(
      {
        usageRequestId: payload.usageRequestId,
        data: {
          decisionReason: data.decisionReason,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetUsageRequestListQueryKey(),
          });
          setOpen(false);
          setMode("view");
          setPayload(null);
        },
      },
    );
  };

  useSubscribe<ViewAndEditDecisionReasonPayload>(
    REQUEST_IMAGE_EVENTS.openViewAndEditDecisionReasonModal,
    (eventPayload) => {
      setPayload(eventPayload);
      setMode("view");
      setOpen(true);
    },
  );

  // 보기 모드
  if (mode === "view") {
    return (
      <Modal
        type="primary"
        icon={<Icon name="AllowRequest" color="#fff" size={18} />}
        modalWidth={370}
        open={open}
        title={`${statusLabel} 사유`}
        showCancelButton={canEdit}
        okText={canEdit ? "수정" : "확인"}
        cancelText="취소"
        onOk={canEdit ? handleEditClick : resetModalState}
        onCancel={resetModalState}
        centered
        showHeaderBorder
        closable
      >
        <Container>
          <DetailCard>
            <SectionTitle>기본 정보</SectionTitle>
            <DetailRow>
              <DetailLabel>{statusLabel}자</DetailLabel>
              <DetailValue>{payload?.deciderName || "-"}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>{statusLabel}일시</DetailLabel>
              <DetailValue>
                {formatDateTimeSafely(payload?.decidedAt)}
              </DetailValue>
            </DetailRow>
          </DetailCard>

          <DetailCard>
            <SectionTitle>{statusLabel} 사유</SectionTitle>
            <ReasonText>{payload?.decisionReason || "-"}</ReasonText>
          </DetailCard>
        </Container>
      </Modal>
    );
  }

  // 수정 모드
  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      title={`${statusLabel} 사유 수정`}
      showCancelButton
      okText="수정 완료"
      cancelText="취소"
      onOk={handleSubmit(onSubmit)}
      onCancel={resetModalState}
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
      <Container>
        <DetailCard>
          <SectionTitle>계정 상세 정보</SectionTitle>
          <DetailRow>
            <DetailLabel>{statusLabel}자</DetailLabel>
            <DetailValue>{payload?.deciderName || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>{statusLabel}일시</DetailLabel>
            <DetailValue>
              {formatDateTimeSafely(payload?.decidedAt)}
            </DetailValue>
          </DetailRow>
        </DetailCard>

        <Form onFinish={handleSubmit(onSubmit)}>
          <Controller
            name="decisionReason"
            control={control}
            render={({ field }) => (
              <LastFormItem
                label="정보 수정"
                required
                htmlFor="decisionReason"
                validateStatus={errors.decisionReason ? "error" : undefined}
                help={errors.decisionReason?.message}
              >
                <TextArea
                  {...field}
                  id="decisionReason"
                  placeholder={`이미지 사용 요청 ${statusLabel} 사유를 입력해 주세요.`}
                  width="100%"
                  rows={6}
                />
              </LastFormItem>
            )}
          />
        </Form>
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const DetailCard = styled.div`
  border-radius: 2px;
  border: 1px solid #e9e9e9;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  width: 100%;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
`;

const DetailLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  min-width: 80px;
  margin-right: 16px;
`;

const DetailValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
  flex: 1;
  word-break: break-all;
`;

const ReasonText = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  white-space: pre-wrap;
  word-break: break-all;
`;
