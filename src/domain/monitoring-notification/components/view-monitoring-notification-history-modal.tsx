"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal, Typography } from "xiilab-ui";

import {
  useGetMonitoringNotificationHistoryDetail,
  useGetSendHistory,
} from "@/api/generated/admin-monitoring-notification-history/admin-monitoring-notification-history";
import {
  createSendHistoryColumns,
  createThresholdDetailColumns,
  type ThresholdDetailRow,
} from "@/domain/monitoring-notification/column/create-monitoring-notification-history-modal-column";
import { THRESHOLD_UNIT } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import { openViewMonitoringNotificationHistoryModalAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import {
  getMetricTypeLabel,
  getThresholdOperatorSymbol,
} from "@/domain/monitoring-notification/utils/monitoring-notification.util";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateTimeSafely } from "@/shared/utils/date.util";

export function ViewMonitoringNotificationHistoryModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openViewMonitoringNotificationHistoryModalAtom,
  );

  const [id, setId] = useState<number | null>(null);

  // 히스토리 상세 조회
  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetMonitoringNotificationHistoryDetail(id ?? 0, {
    query: { enabled: id !== null },
  });

  // 발송 이력 조회
  const { data: sendHistory } = useGetSendHistory(id ?? 0, {
    query: { enabled: id !== null },
  });

  // 임계 조건 테이블 데이터 변환
  const thresholdData: ThresholdDetailRow[] = useMemo(() => {
    if (!detail) return [];
    return [
      {
        key: "threshold",
        item: getMetricTypeLabel(detail.metricType),
        setting: `${getThresholdOperatorSymbol(detail.thresholdOperator)} ${detail.thresholdValue}${THRESHOLD_UNIT}`,
        observed: `${detail.observedValue}${THRESHOLD_UNIT}`,
      },
    ];
  }, [detail]);

  useSubscribe(
    MONITORING_EVENTS.sendNotificationHistory,
    ({ id }: { id: number }) => {
      setId(id);
      onOpen();
    },
  );

  if (isDetailError) {
    return (
      <InfoModal
        type="primary"
        icon={<Icon name="Description" color="#fff" size={18} />}
        modalWidth={580}
        open={open}
        closable
        title="알림 내역 조회"
        onClose={onClose}
        centered
        showHeaderBorder
      >
        <DataErrorState />
      </InfoModal>
    );
  }

  return (
    <InfoModal
      type="primary"
      icon={<Icon name="Description" color="#fff" size={18} />}
      modalWidth={580}
      open={open}
      closable
      title="알림 내역 조회"
      onClose={onClose}
      centered
      showHeaderBorder
      loading={isDetailLoading}
    >
      <Container>
        <TopWrapper>
          {/* 기본 정보 섹션 */}
          <InfoSection>
            <InfoRow>
              <InfoItem>
                <InfoLabel>알림 이름</InfoLabel>
                <InfoValue>{detail?.notificationSetName || "-"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>발생 일시</InfoLabel>
                <InfoValue>
                  {formatDateTimeSafely(detail?.createdAt) ?? "-"}
                </InfoValue>
              </InfoItem>
            </InfoRow>
            <InfoRow>
              <InfoItem>
                <InfoLabel>IP 주소</InfoLabel>
                <InfoValue>{detail?.nodeIp || "-"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>노드 이름</InfoLabel>
                <InfoValue>{detail?.nodeName || "-"}</InfoValue>
              </InfoItem>
            </InfoRow>
          </InfoSection>

          {/* 알림 임계 조건 설정 테이블 */}
          <TableSection>
            <SectionTitle>알림 임계 조건 설정</SectionTitle>
            <ScrollableTableWrapper $height={128}>
              <CustomizedTable
                columns={createThresholdDetailColumns()}
                data={thresholdData}
                activePadding
              />
            </ScrollableTableWrapper>
          </TableSection>
        </TopWrapper>
        {/* 발송 이력 테이블 */}
        <TableSection>
          <SectionTitle>발송 이력</SectionTitle>
          <ScrollableTableWrapper $height={200}>
            <CustomizedTable
              columns={createSendHistoryColumns()}
              data={sendHistory ?? []}
              activePadding
              tableLayout="fixed"
              scroll={{ x: "100%" }}
            />
          </ScrollableTableWrapper>
        </TableSection>
      </Container>
    </InfoModal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #E9E9E9;
  border-radius: 4px;
  padding: 16px;

`;

const InfoSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding-bottom: 14px;
  border-bottom: 1px solid #E9E9E9;
  background-color: #f9f9f9;

  &::after {
    content: "";
    position: absolute;
    top: 0px;
    bottom: 7px;
    left: 48%;

    width: 1px;
    background-color: #E9E9E9;
  }
`;

const InfoRow = styled.div`
  display: flex;
  gap: 24px;
`;

const InfoItem = styled.div`
  flex: 1;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  min-width: 0;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #484848;
  min-width: 60px;
  flex: 0 0 60px;
`;

const InfoValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
  flex: 1 1 auto;
  min-width: 0;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const TableSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ScrollableTableWrapper = styled.div<{ $height: number }>`
  width: 100%;
  max-height: ${({ $height }) => $height}px;
  overflow: hidden;
`;

const SectionTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: #000;
  margin: 0;
`;
