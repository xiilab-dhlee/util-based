"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { Card, CardImageContainer, CardImagePlaceholder } from "xiilab-ui";

import type { FindHubsResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ROUTES } from "@/shared/constants/routes.constant";

interface HubCardProps extends FindHubsResponse {}

/**
 * HubCard 컴포넌트
 *
 * 허브 정보를 카드 형태로 표시하며, 클릭 시 해당 허브 상세 페이지로 이동합니다.
 * 허브의 썸네일 이미지, 제목, 설명을 포함한 주요 정보를 시각적으로 표현합니다.
 *
 * @returns 허브 정보를 담은 카드 컴포넌트
 */
export function HubCard({
  hubId,
  hubName,
  modelType,
  thumbnail,
  description,
}: HubCardProps) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();

  // URL 파라미터에서 현재 선택된 허브 ID 확인
  const selectedHubId = params.id ? Number(params.id) : -1;
  const isSelected = selectedHubId === hubId;

  /**
   * 카드 클릭 핸들러
   * 해당 허브 상세 페이지로 이동
   */
  const handleClick = () => {
    router.push(ROUTES.USER_HUB_DETAIL(hubId));
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      title={hubName}
      subtitle={modelType}
      style={{ borderColor: isSelected ? "#366BFF" : "" }}
    >
      {/* 허브 썸네일 이미지 영역 */}
      <CardImageContainer>
        <CardImagePlaceholder>이미지 없음</CardImagePlaceholder>
        {thumbnail && (
          <ImageWrapper>
            <Image src={thumbnail} alt="Hub Thumbnail" layout="fill" />
          </ImageWrapper>
        )}
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
/**
 * 허브 설명 텍스트를 위한 스타일드 컴포넌트
 * - 여러 줄 텍스트 줄임표 처리 (최대 3줄)
 * - 텍스트가 3줄을 초과하면 자동으로 줄임표(...) 표시
 */
const Description = styled.p`
  flex: 1;
  font-weight: 400;
  width: 100%;
  font-size: 10px;
  line-height: 12px;
  margin-top: 8px;
  color: #000;

  /* 여러 줄 텍스트 줄임표 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 3줄까지만 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
