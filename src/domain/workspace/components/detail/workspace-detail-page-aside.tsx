"use client";

import styled from "styled-components";

import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { WorkspaceIntroCard } from "./workspace-intro-card";
import { WorkspaceResourceAllocCard } from "./workspace-resource-alloc-card";
import { WorkspaceResourceUsageCard } from "./workspace-resource-usage-card";

/**
 * 워크스페이스 상세 페이지의 공통 사이드바 컴포넌트
 * 워크스페이스 정보와 리소스 정보를 표시합니다.
 */
export function WorkspaceDetailPageAside() {
  return (
    <DetailPageAside>
      {/* 워크스페이스 정보 */}
      <WorkspaceIntroCard />
      {/* 리소스 정보 */}
      <AsideFillCard title="리소스 정보">
        <CardWrapper>
          <WorkspaceResourceUsageCard />
          <WorkspaceResourceAllocCard />
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
