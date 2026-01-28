"use client";

import { useParams, useSearchParams } from "next/navigation";

import { useGetWorkloadDetail } from "@/api/generated/workload/workload";
import { WorkloadEventHistoryPanel } from "@/domain/workload/components/detail/workload-event-history-panel";
import { WorkloadInfoPanel } from "@/domain/workload/components/detail/workload-info-panel";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";

/**
 * 워크로드 상세 페이지의 공통 사이드바 컴포넌트
 * 워크로드 정보와 이벤트 이력을 표시합니다.
 *
 * API 호출을 중앙화하여 하위 컴포넌트에 props로 전달합니다.
 */
export function WorkloadDetailPageAside() {
  const params = useParams();
  const searchParams = useSearchParams();

  const workloadId = params?.id as string;
  const workspaceId = Number(searchParams?.get("workspaceId") || "");

  // 워크로드 상세 데이터 조회
  const { data } = useGetWorkloadDetail(workspaceId, workloadId, {
    query: {
      enabled: Boolean(workspaceId && workloadId),
    },
  });

  return (
    <DetailPageAside>
      {/* 워크로드 정보 패널 - 내부에서 상태 폴링 처리 */}
      <WorkloadInfoPanel data={data} />
      {/* 이벤트 이력 */}
      <WorkloadEventHistoryPanel
        workspaceId={workspaceId}
        workloadResourceName={workloadId}
        isDistributed={data?.workloadJobType === "DISTRIBUTED"}
      />
    </DetailPageAside>
  );
}
