"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { WorkloadEventType } from "@/domain/workload/schemas/workload.schema";
import { CompactCardCollapseRow } from "@/shared/components/card/compact-card-collapse-row";
import {
  CompactCardKey,
  CompactCardKeyValueRow,
  CompactCardValue,
} from "@/shared/components/card/compact-card-layer.styled";
import { EventStatusText } from "@/shared/components/text/event-status-text";

interface WorkloadEventCardProps extends Omit<WorkloadEventType, "id"> {}
// 이벤트 이력 카드 컴포넌트
export function WorkloadEventCard({
  name,
  elapsedTime,
  from,
  message,
  status,
}: WorkloadEventCardProps) {
  return (
    <Card
      contentVariant="compact"
      actionElement={<EventStatusText status={status} />}
      title={name}
    >
      <Body>
        <CompactCardKeyValueRow>
          <Key>경과 시간</Key>
          <CompactCardValue>{elapsedTime}</CompactCardValue>
        </CompactCardKeyValueRow>
        <CompactCardKeyValueRow>
          <Key>From</Key>
          <CompactCardValue>{from}</CompactCardValue>
        </CompactCardKeyValueRow>
      </Body>
      <Footer>
        <CompactCardCollapseRow title="메 세 지" description={message} />
      </Footer>
    </Card>
  );
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e9ebee;
  padding-bottom: 6px;
  margin-bottom: 4px;
  gap: 4px;
  width: 100%;
`;

const Key = styled(CompactCardKey)`
  width: 48px;
  position: relative;
  line-height: 14px;

  &::after {
    position: absolute;
    content: ":";
    line-height: 12px;
    top: 0;
    right: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2px;
  width: 100%;
`;
