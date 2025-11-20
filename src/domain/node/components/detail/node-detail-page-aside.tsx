"use client";

import Image from "next/image";
import styled from "styled-components";

import { AsideFillCard } from "@/shared/layouts/aside/aside-fill-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { ListSectionTitle } from "@/styles/layers/list-page-layers.styled";
import { NodeIntroCard } from "./node-intro-card";

/**
 * NodeDetailPageAside 컴포넌트
 *
 * 노드 상세 페이지의 사이드바 영역을 구성하는 컴포넌트입니다.
 * 노드의 기본 정보를 표시하는 NodeIntroCard와 노드 사용 가이드를 제공하는
 * 가이드 카드를 포함하여 사용자가 노드 정보를 쉽게 이해할 수 있도록 도와줍니다.
 *
 * @returns 노드 상세 페이지의 사이드바 컴포넌트
 */
export function NodeDetailPageAside() {
  return (
    <DetailPageAside>
      {/* 노드의 기본 정보를 표시하는 카드 */}
      <NodeIntroCard />
      {/* 노드 자원 상세정보 가이드 카드 */}
      <AsideFillCard>
        <Title>노드 자원 상세정보 가이드</Title>
        {/* 노드 자원 상세정보 가이드 이미지 */}
        <GuideItem>
          <Image
            src="/images/node-detail-guide1.png"
            alt="노드 자원 상세정보 가이드"
            width={360}
            height={150}
            priority
          />
        </GuideItem>
        {/* 하드웨어 장치 및 구성 정보 가이드 제목 */}
        <Title>하드웨어 장치 및 구성 정보 가이드</Title>
        {/* 하드웨어 장치 및 구성 정보 가이드 이미지 */}
        <GuideItem>
          <Image
            src="/images/node-detail-guide2.png"
            alt="하드웨어 장치 및 구성 정보 가이드"
            width={360}
            height={150}
          />
        </GuideItem>
        {/* 로그 가이드 제목 */}
        <Title>로그 가이드</Title>
        {/* 로그 가이드 이미지 */}
        <GuideItem>
          <Image
            src="/images/node-detail-guide3.png"
            alt="로그 가이드"
            width={360}
            height={150}
          />
        </GuideItem>
      </AsideFillCard>
    </DetailPageAside>
  );
}

/**
 * 가이드 섹션 제목 스타일
 * 가이드 카드 내의 각 섹션 제목을 표시하는 스타일입니다.
 */
const Title = styled(ListSectionTitle)`
  margin-bottom: 13px;
`;

/**
 * 가이드 이미지 컨테이너 스타일
 * 가이드 이미지를 표시하는 컨테이너로, 고정된 높이와 오버플로우 처리를 포함합니다.
 */
const GuideItem = styled.div`
  width: 100%;
  height: 150px;
  overflow: hidden;
  position: relative;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;
