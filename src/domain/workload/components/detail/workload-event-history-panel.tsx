"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Card } from "xiilab-ui";

import { useGetWorkloadEventHistory } from "@/api/generated/workload/workload";
import { WorkloadEventCard } from "@/domain/workload/components/detail/workload-event-card";
import { workloadSelectedPodNameAtom } from "@/domain/workload/state/workload.atom";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";

interface WorkloadEventHistoryPanelProps {
  workspaceId: number;
  workloadResourceName: string;
  isDistributed?: boolean;
}

/**
 * 워크로드 이벤트 이력 패널 컴포넌트
 *
 * orval의 useGetWorkloadEventHistory API를 사용하여 이벤트 이력을 조회합니다.
 * 분산 워크로드인 경우 선택된 Pod의 이벤트 이력을 조회합니다.
 */
export function WorkloadEventHistoryPanel({
  workspaceId,
  workloadResourceName,
  isDistributed = false,
}: WorkloadEventHistoryPanelProps) {
  const selectedPodName = useAtomValue(workloadSelectedPodNameAtom);

  const { data, isLoading, isError } = useGetWorkloadEventHistory(
    workspaceId,
    workloadResourceName,
    selectedPodName ? { podName: selectedPodName } : undefined,
    {
      query: {
        enabled:
          !!workspaceId &&
          !!workloadResourceName &&
          (!isDistributed || !!selectedPodName),
      },
    },
  );

  const events = data?.events ?? [];

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <Card key={`skeleton-${index}`} loading style={{ height: 145 }} />
      ));
    }
    if (isError) {
      return <EmptyState title={TABLE_MESSAGE.ERROR} />;
    }
    if (events.length === 0) {
      return <EmptyState title={TABLE_MESSAGE.EMPTY} />;
    }

    return events.map((item, index) => (
      <WorkloadEventCard
        key={`${item.eventReason}-${item.eventCreatedAt}-${index}`}
        {...item}
      />
    ));
  };

  return (
    <AsideFillCard title="이벤트 이력">
      <Container>{renderContent()}</Container>
    </AsideFillCard>
  );
}

const Container = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
