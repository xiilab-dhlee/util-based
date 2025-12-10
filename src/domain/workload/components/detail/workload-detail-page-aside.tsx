"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { useGetWorkloadByMode } from "@/domain/workload/hooks/use-get-workload-by-mode";
import type { WorkloadEventType } from "@/domain/workload/schemas/workload.schema";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import { WorkloadEventCard } from "./workload-event-card";
import { WorkloadIntroCard } from "./workload-intro-card";

/**
 * 워크로드 상세 페이지의 공통 사이드바 컴포넌트
 * 워크로드 정보와 이벤트 이력을 표시합니다.
 */
export function WorkloadDetailPageAside() {
  const params = useParams();
  const searchParams = useSearchParams();

  const { data } = useGetWorkloadByMode({
    workspaceId: searchParams?.get("workspaceId") || "",
    workloadId: params?.id as string,
  });

  return (
    <DetailPageAside data-testid={WORKLOAD_SELECTOR.DETAIL_ASIDE}>
      {/* 워크로드 정보 */}
      {data && <WorkloadIntroCard {...data} />}
      {/* 이벤트 이력 */}
      <AsideFillCard
        title="이벤트 이력"
        data-testid={WORKLOAD_SELECTOR.DETAIL_EVENT_SECTION}
      >
        <CardWrapper>
          {data?.events.map((item: WorkloadEventType, index: number) => (
            <WorkloadEventCard key={item.id} index={index} {...item} />
          ))}
        </CardWrapper>
      </AsideFillCard>
    </DetailPageAside>
  );
}

const CardWrapper = styled.div`
  overflow-y: auto;

  ${customScrollbar()}
`;
