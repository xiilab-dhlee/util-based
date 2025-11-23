"use client";

import styled from "styled-components";

import { vulnerabilityListMock } from "@/mocks/data/vulnerability.mock";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { customScrollbar } from "@/styles/mixins/scrollbar";
import { VulnerabilityCard } from "../../../security/vulnerability-card";
import { InternalRegistryImageTagDetailIntroCard } from "./internal-registry-image-tag-detail-intro-card";

/**
 * 내부 레지스트리 이미지 상세 페이지 왼쪽 영역 컴포넌트
 *
 * 이미지 기본 정보 카드를 포함합니다.
 */
export function PrivateRegistryImageTagDetailAside() {
  return (
    <DetailPageAside>
      {/* 이미지 기본 정보 카드 */}
      <InternalRegistryImageTagDetailIntroCard />
      <AsideFillCard
        title="취약점 Critical 목록"
        titleExtra={`총 ${vulnerabilityListMock.length}개`}
      >
        <GridBody>
          {vulnerabilityListMock.map((vulnerability) => (
            <VulnerabilityCard key={vulnerability.id} {...vulnerability} />
          ))}
        </GridBody>
      </AsideFillCard>
    </DetailPageAside>
  );
}

const GridBody = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  height: 380px;
  overflow-y: auto;
  width: 100%;

  ${customScrollbar()}
`;
