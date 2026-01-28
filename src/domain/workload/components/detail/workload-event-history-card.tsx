"use client";

import styled from "styled-components";

import { useGetWorkloadEventHistory } from "@/api/generated/workload/workload";
import { WorkloadEventCard } from "@/domain/workload/components/detail/workload-event-card";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { MySpinner } from "@/shared/components/spinner";

interface WorkloadEventHistoryCardProps {
  workspaceId: number;
  workloadResourceName: string;
}

/**
 * 워크로드 이벤트 이력 카드 컴포넌트
 *
 * orval의 useGetWorkloadEventHistory API를 사용하여 이벤트 이력을 조회합니다.
 */
export function WorkloadEventHistoryCard({
  workspaceId,
  workloadResourceName,
}: WorkloadEventHistoryCardProps) {
  const { data, isLoading } = useGetWorkloadEventHistory(
    workspaceId,
    workloadResourceName,
    undefined,
    {
      query: {
        enabled: !!workspaceId && !!workloadResourceName,
      },
    },
  );

  const events = data?.events ?? [];

  return (
    <AsideFillCard title="이벤트 이력">
      <CardWrapper>
        {isLoading ? (
          <SpinnerWrapper>
            <MySpinner />
          </SpinnerWrapper>
        ) : events.length > 0 ? (
          events.map((item, index) => (
            <WorkloadEventCard
              key={`${item.eventReason}-${item.eventCreatedAt}-${index}`}
              name={item.eventReason}
              elapsedTime={item.eventCreatedAt}
              from={item.eventFrom}
              message={item.eventMessage}
              status={item.eventType === "Warning" ? "warning" : "normal"}
            />
          ))
        ) : (
          <EmptyMessage>이벤트 이력이 없습니다.</EmptyMessage>
        )}
      </CardWrapper>
    </AsideFillCard>
  );
}

const CardWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
`;

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  color: #828588;
  font-size: 14px;
`;
