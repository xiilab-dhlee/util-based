"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { WorkloadEventCard } from "@/domain/workload/components/detail/workload-event-card";
import { WorkloadIntroCard } from "@/domain/workload/components/detail/workload-intro-card";
import { useGetWorkloadByMode } from "@/domain/workload/hooks/use-get-workload-by-mode";
import { useWorkloadStatusPolling } from "@/domain/workload/hooks/use-workload-status-polling";
import type { WorkloadEventType } from "@/domain/workload/schemas/workload.schema";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";

/**
 * 워크로드 상세 페이지의 공통 사이드바 컴포넌트
 * 워크로드 정보와 이벤트 이력을 표시합니다.
 */
export function WorkloadDetailPageAside() {
  const params = useParams();
  const searchParams = useSearchParams();

  const workloadId = params?.id as string;
  const workspaceId = searchParams?.get("workspaceId") || "";

  // 워크로드 전체 데이터 조회
  const { data } = useGetWorkloadByMode({
    workspaceId: Number(workspaceId),
    workloadId,
  });

  // 워크로드 상태 실시간 폴링 (10초마다 상태만 조회)
  const { status: polledStatus } = useWorkloadStatusPolling({
    workspaceId: Number(workspaceId),
    workloadResourceName: workloadId,
    enabled: Boolean(workspaceId && workloadId),
  });

  return (
    <DetailPageAside>
      {/* 워크로드 정보 - 폴링된 최신 상태 사용 */}
      {data && (
        <WorkloadIntroCard {...data} status={polledStatus || data.status} />
      )}
      {/* 이벤트 이력 */}
      <AsideFillCard title="이벤트 이력">
        <CardWrapper>
          {data?.events.map((item: WorkloadEventType) => (
            <WorkloadEventCard key={item.id} {...item} />
          ))}
        </CardWrapper>
      </AsideFillCard>
    </DetailPageAside>
  );
}

const CardWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
