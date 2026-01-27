"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal, TextArea, Typography } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ImageTagListResponseApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useCancelImageUsageRequestAction } from "@/domain/registry/hooks/use-cancel-image-usage-request";
import { VulnerabilitySummary } from "@/shared/components/summary/vulnerability-summary";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatFileSize } from "@/shared/utils/file.util";

interface UsageRequestDetailPayload extends ImageTagListResponse {
  /** 사용 요청 ID (취소 시 필요) */
  usageRequestId?: number;
}

/**
 * 이미지 사용 요청 상세 모달
 *
 * Figma 디자인 기반:
 * - 기본 정보 (태그명, 이미지 크기, 설명)
 * - 요청 정보 (요청자, 요청일시)
 * - 보안 검사 정보 (Critical/High/Medium/Low)
 * - 요청 사유 (읽기 전용)
 * - 승인 대기 상태일 때만 "요청 취소" 버튼 활성화
 */
export function ViewImageUsageRequestModal() {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<UsageRequestDetailPayload | null>(
    null,
  );

  const cancelMutation = useCancelImageUsageRequestAction();
  const isPending = cancelMutation.isPending;

  const isApprovalWaiting =
    payload?.approvalStatus ===
    ImageTagListResponseApprovalStatus.APPROVAL_WAITING;
  const hasUsageRequestId = !!payload?.usageRequestId;

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
    setPayload(null);
  };

  const handleCancel = () => {
    if (isPending) return;
    if (!payload?.usageRequestId) return;

    cancelMutation.mutate(
      { usageRequestId: payload.usageRequestId },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  useSubscribe<UsageRequestDetailPayload>(
    REGISTRY_EVENTS.openUsageRequestDetailModal,
    (eventData) => {
      setPayload(eventData);
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="RequestResource" color="#fff" size={20} />}
      modalWidth={560}
      open={open}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      title="이미지 사용 요청"
      showCancelButton
      cancelText="취소"
      okText="요청 취소"
      onOk={handleCancel}
      onCancel={handleClose}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: !isApprovalWaiting || !hasUsageRequestId || isPending,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <Container>
        <ContentWrapper>
          {/* 왼쪽: 기본 정보 + 보안 검사 정보 */}
          <LeftSection>
            <SectionTitle>기본 정보</SectionTitle>
            <DetailRow>
              <DetailLabel>태그명</DetailLabel>
              <DetailValue>{payload?.imageTagName || "-"}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>이미지 크기</DetailLabel>
              <DetailValue>
                {payload?.imageTagSizeByte != null
                  ? formatFileSize(payload.imageTagSizeByte).formatted
                  : "-"}
              </DetailValue>
            </DetailRow>

            <DescriptionSection>
              <DetailLabel>결정 사유</DetailLabel>
              <DescriptionText>
                {payload?.decisionReason || "-"}
              </DescriptionText>
            </DescriptionSection>

            <Divider />

            <SectionTitle>보안 검사 정보</SectionTitle>
            {payload?.vulnerability ? (
              <VulnerabilitySummary
                critical={payload.vulnerability.criticalCount ?? 0}
                high={payload.vulnerability.highCount ?? 0}
                medium={payload.vulnerability.mediumCount ?? 0}
                low={payload.vulnerability.lowCount ?? 0}
              />
            ) : (
              <NoDataText>보안 검사 정보가 없습니다.</NoDataText>
            )}
          </LeftSection>

          {/* 오른쪽: 요청 정보 + 요청 사유 */}
          <RightSection>
            <SectionTitle>요청 정보</SectionTitle>
            <DetailRow>
              <DetailLabel>요청자</DetailLabel>
              <DetailValue>{payload?.creatorName || "-"}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>요청일시</DetailLabel>
              <DetailValue>
                {formatDateTimeSafely(payload?.createdAt)}
              </DetailValue>
            </DetailRow>

            <Divider />

            <RequestReasonSection>
              <RequestReasonLabel>
                요청 사유 <RequiredMark>*</RequiredMark>
              </RequestReasonLabel>
              <TextArea
                value={payload?.requestReason || ""}
                readOnly
                rows={4}
                width="100%"
                placeholder="요청 사유가 없습니다."
              />
            </RequestReasonSection>
          </RightSection>
        </ContentWrapper>
      </Container>
    </Modal>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 24px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const DescriptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DescriptionText = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  line-height: 1.5;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 8px 0;
`;

const RequestReasonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RequestReasonLabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #000;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RequiredMark = styled.span`
  color: #ff4d4f;
`;

const NoDataText = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #9e9e9e;
`;
