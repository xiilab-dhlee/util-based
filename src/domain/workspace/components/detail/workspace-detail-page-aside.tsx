"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import { useGetAdminWorkspaceDetail } from "@/api/generated/admin-workspace/admin-workspace";
import { WorkspaceIntroCard } from "@/domain/workspace/components/detail/workspace-intro-card";
import { WorkspaceResourceAllocCard } from "@/domain/workspace/components/detail/workspace-resource-alloc-card";
import { WorkspaceResourceUsageCard } from "@/domain/workspace/components/detail/workspace-resource-usage-card";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";

/**
 * 워크스페이스 상세 페이지의 공통 사이드바 컴포넌트
 * 워크스페이스 정보와 리소스 정보를 표시합니다.
 */
export function WorkspaceDetailPageAside() {
  const { id } = useParams<{ id: string }>();
  const workspaceId = Number(id);
  const isValidWorkspaceId = Number.isFinite(workspaceId);

  const { data: workspace } = useGetAdminWorkspaceDetail(workspaceId, {
    query: {
      enabled: isValidWorkspaceId,
    },
  });

  const resource = workspace?.resource;

  return (
    <DetailPageAside>
      {/* 워크스페이스 정보 */}
      <WorkspaceIntroCard workspace={workspace} />
      {/* 리소스 정보 */}
      <AsideFillCard title="리소스 정보">
        <CardWrapper>
          <WorkspaceResourceUsageCard resource={resource} />
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
