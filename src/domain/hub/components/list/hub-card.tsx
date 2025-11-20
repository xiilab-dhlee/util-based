"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import styled from "styled-components";
import { Card, CardImageContainer, CardImagePlaceholder } from "xiilab-ui";

import type { HubListType } from "@/domain/hub/schemas/hub.schema";
import { hubSelectedAtom } from "@/domain/hub/state/hub.atom";

interface HubCardProps extends HubListType {}

/**
 * HubCard 컴포넌트의 실제 구현부
 *
 * 허브 정보를 카드 형태로 표시하며, 클릭 시 해당 허브를 선택합니다.
 * 허브의 썸네일 이미지, 제목, 설명을 포함한 주요 정보를 시각적으로 표현합니다.
 *
 * @returns 허브 정보를 담은 카드 컴포넌트
 */
export function HubCard({ id, title, description }: HubCardProps) {
  // 허브 선택 상태를 변경하기 위한 atom setter
  const [selectedHub, setSelectedHub] = useAtom(hubSelectedAtom);

  /**
   * 카드 클릭 핸들러
   * 카드 클릭 시 해당 허브를 선택된 상태로 변경
   */
  const handleClick = () => {
    setSelectedHub(id);
  };

  return (
    <Card
      height={156}
      hoverable
      onClick={handleClick}
      title={title}
      subtitle="Object Detection"
      style={{ borderColor: selectedHub === id ? "#366BFF" : "" }}
    >
      {/* 허브 썸네일 이미지 영역 */}
      <CardImageContainer style={{ height: 66 }}>
        <CardImagePlaceholder>이미지 없음</CardImagePlaceholder>
        <ImageWrapper>
          <Image src="/images/hub-thumbnail.png" alt="hub" layout="fill" />
        </ImageWrapper>
      </CardImageContainer>

      {/* 허브 설명 텍스트 (최대 3줄, 초과 시 줄임표 처리) */}
      <Description>{description}</Description>
    </Card>
  );
}

/**
 * 허브 설명 텍스트를 위한 스타일드 컴포넌트
 * - 여러 줄 텍스트 줄임표 처리 (최대 3줄)
 * - 텍스트가 3줄을 초과하면 자동으로 줄임표(...) 표시
 */
const Description = styled.p`
  flex: 1;
  font-weight: 400;
  font-size: 10px;
  line-height: 10px;
  margin-top: 10px;
  color: #000;

  /* 여러 줄 텍스트 줄임표 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 최대 3줄까지만 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  /* 최대 높이 설정 (3줄 * 12px line-height) */
  max-height: 30px;
`;

/**
 * 허브 썸네일 이미지를 감싸는 래퍼 컴포넌트
 * - 이미지 크기 고정 및 오버플로우 처리
 * - 이미지가 없을 경우 플레이스홀더 배경 표시
 */
const ImageWrapper = styled.div`
  height: 66px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
`;
