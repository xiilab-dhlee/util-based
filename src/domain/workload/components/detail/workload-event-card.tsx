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
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

interface WorkloadEventCardProps extends Omit<WorkloadEventType, "id"> {
  index: number;
}
// 이벤트 이력 카드 컴포넌트
export function WorkloadEventCard({
  index,
  name,
  elapsedTime,
  from,
  message,
  status,
}: WorkloadEventCardProps) {
  return (
    <CardWrapper data-testid={WORKLOAD_SELECTOR.eventCard(index)}>
      <StyledCard
        contentVariant="compact"
        actionElement={
          <span data-testid={WORKLOAD_SELECTOR.EVENT_STATUS}>
            <EventStatusText status={status} />
          </span>
        }
        title={name}
      >
        <Body>
          <CompactCardKeyValueRow>
            <Key>경과 시간</Key>
            <CompactCardValue
              data-testid={WORKLOAD_SELECTOR.EVENT_ELAPSED_TIME}
            >
              {elapsedTime}
            </CompactCardValue>
          </CompactCardKeyValueRow>
          <CompactCardKeyValueRow>
            <Key>From</Key>
            <CompactCardValue data-testid={WORKLOAD_SELECTOR.EVENT_FROM}>
              {from}
            </CompactCardValue>
          </CompactCardKeyValueRow>
        </Body>
        <Footer>
          <CompactCardCollapseRow
            title="메 세 지"
            description={message}
            data-testid={WORKLOAD_SELECTOR.EVENT_MESSAGE}
          />
        </Footer>
      </StyledCard>
    </CardWrapper>
  );
}

const CardWrapper = styled.div``;

const StyledCard = styled(Card)`  
  & + & {
    margin-top: 8px;
  }
`;

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
