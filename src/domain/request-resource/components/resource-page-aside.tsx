"use client";

import styled from "styled-components";

import { ResourceCard } from "@/domain/request-resource/components/resource-card";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";

export function ResourcePageAside() {
  return (
    <AsideFillCard title="전체 리소스 사용량 및 할당량">
      <Body>
        <ResourceCard
          resourceType="GPU"
          usage={3333}
          request={6666}
          limit={9999}
        />
        <ResourceCard
          resourceType="MIG"
          usage={3333}
          request={6666}
          limit={9999}
        />
        <ResourceCard
          resourceType="CPU"
          usage={3333}
          request={6666}
          limit={9999}
        />
        <ResourceCard
          resourceType="MEM"
          usage={3333}
          request={6666}
          limit={9999}
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
