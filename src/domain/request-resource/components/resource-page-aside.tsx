"use client";

import styled from "styled-components";

import { useGetClusterResourceOverview } from "@/api/generated/admin-cluster/admin-cluster";
import { ResourceCard } from "@/domain/request-resource/components/resource-card";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { convertBytes } from "@/shared/utils/resource.util";

export function ResourcePageAside() {
  const { data } = useGetClusterResourceOverview();
  const gpuCount = data?.gpuCount;
  const migCount = data?.migCount;
  const cpuCore = data?.cpuCore;
  const memoryBytes = data?.memoryBytes;

  const gpuUsage = gpuCount?.used ?? 0;
  const gpuRequest = gpuCount?.available ?? 0;
  const gpuLimit = gpuCount?.total ?? 0;

  const migUsage = migCount?.used ?? 0;
  const migRequest = migCount?.available ?? 0;
  const migLimit = migCount?.total ?? 0;

  const cpuUsage = cpuCore?.used ?? 0;
  const cpuRequest = cpuCore?.available ?? 0;
  const cpuLimit = cpuCore?.total ?? 0;

  const memoryUsage = convertBytes(memoryBytes?.used ?? 0, "GB").value;
  const memoryRequest = convertBytes(memoryBytes?.available ?? 0, "GB").value;
  const memoryLimit = convertBytes(memoryBytes?.total ?? 0, "GB").value;

  return (
    <AsideFillCard title="전체 리소스 사용량 및 할당량">
      <Body>
        <ResourceCard
          resourceType="GPU"
          usage={gpuUsage}
          request={gpuRequest}
          limit={gpuLimit}
        />
        <ResourceCard
          resourceType="MIG"
          usage={migUsage}
          request={migRequest}
          limit={migLimit}
        />
        <ResourceCard
          resourceType="CPU"
          usage={cpuUsage}
          request={cpuRequest}
          limit={cpuLimit}
        />
        <ResourceCard
          resourceType="MEM"
          usage={memoryUsage}
          request={memoryRequest}
          limit={memoryLimit}
        />
      </Body>
    </AsideFillCard>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

/**
 * 카드 본문 영역
 * 워크스페이스 상세 정보들을 세로로 배치
 */
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
`;
