"use client";

import { useParams, useSearchParams } from "next/navigation";
import styled from "styled-components";

import { useGetWorkloadByMode } from "@/hooks/workload/use-get-workload-by-mode";
import { AsideFillCard } from "@/layouts/aside/aside-fill-card";
import type { WorkloadEventType } from "@/schemas/workload.schema";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
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
    <DetailPageAside>
      {/* 워크로드 정보 */}
      {data && <WorkloadIntroCard {...data} />}
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
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
