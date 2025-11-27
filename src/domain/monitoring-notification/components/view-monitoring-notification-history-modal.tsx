"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal, Typography } from "xiilab-ui";

import { useGetMonitoringNotification } from "@/domain/monitoring-notification/hooks/use-get-monitoring-notification";
import { openViewMonitoringNotificationHistoryModalAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { createMonitoringNotificationHistoryColumn } from "../column/create-monitoring-notification-history-column";

// Mock 발송 이력 데이터
const MOCK_SEND_HISTORY = [
  {
    userName: "정은하",
    type: "E-mail, System",
    result: "성공",
    sentAt: new Date("2024-12-12T05:23:12"),
  },
  {
    userName: "손지원",
    channel: "E-mail",
    result: "성공",
    sentAt: new Date("2024-12-12T05:23:12"),
  },
  {
    userName: "방성은",
    channel: "E-mail, System",
    result: "성공",
    sentAt: new Date("2024-12-12T05:23:12"),
  },
  {
    userName: "서경덕",
    channel: "E-mail, System",
    result: "성공",
    sentAt: new Date("2024-12-12T05:23:12"),
  },
  {
    userName: "이수빈",
    channel: "System",
    result: "성공",
    sentAt: new Date("2024-12-12T05:23:12"),
  },
  {
    userName: "이수빈",
    channel: "System",
    result: "성공",
    sentAt: new Date("2024-12-12T05:23:12"),
  },
];

export function ViewMonitoringNotificationHistoryModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openViewMonitoringNotificationHistoryModalAtom,
  );

  const [id, setId] = useState("");
  const { data } = useGetMonitoringNotification(id);

  useSubscribe(
    MONITORING_EVENTS.sendNotificationHistory,
    ({ id }: { id: string }) => {
      setId(id);
      onOpen();
    },
  );

  return (
    <InfoModal
      type="primary"
      icon={<Icon name="Search" color="#fff" size={14} />}
      modalWidth={580}
      open={open}
      closable
      title="알림 내역 조회"
      onClose={onClose}
      centered
      showHeaderBorder
    >
      <Container>
        <TopWrapper>
          {/* 기본 정보 섹션 */}
          <InfoSection>
            <InfoRow>
              <InfoItem>
                <InfoLabel>알림 이름</InfoLabel>
                <InfoValue>{data?.name || "-"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>발생 일시</InfoLabel>
                <InfoValue>
                  {formatDateTimeSafely(data?.creatorDateTime) ?? "-"}
                </InfoValue>
              </InfoItem>
            </InfoRow>
            <InfoRow>
              <InfoItem>
                <InfoLabel>IP 주소</InfoLabel>
                <InfoValue>{data?.ip || "-"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>노드 이름</InfoLabel>
                <InfoValue>{data?.nodeName || "-"}</InfoValue>
              </InfoItem>
            </InfoRow>
          </InfoSection>

          {/* 알림 임계 조건 설정 테이블 */}
          <TableSection>
            <SectionTitle>알림 임계 조건 설정</SectionTitle>
            <ScrollableTableWrapper $height={128}>
              <CustomizedTable
                columns={createMonitoringNotificationHistoryColumn([
                  {
                    dataIndex: "item",
                  },
                  {
                    dataIndex: "setting",
                  },
                  {
                    dataIndex: "duration",
                  },
                ])}
                data={data?.settings || []}
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
              columns={createMonitoringNotificationHistoryColumn([
                {
                  dataIndex: "userName",
                },
                {
                  dataIndex: "channel",
                },
                {
                  dataIndex: "result",
                },
                {
                  dataIndex: "sentAt",
                },
              ])}
              data={MOCK_SEND_HISTORY}
              activePadding
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
`;

const InfoLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #484848;
  min-width: 60px;
`;

const InfoValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
color: #000;
`;

const TableSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ScrollableTableWrapper = styled.div<{ $height: number }>`
  max-height: ${({ $height }) => $height}px;
  overflow-y: auto;
`;

const SectionTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: #000;
  margin: 0;
`;
