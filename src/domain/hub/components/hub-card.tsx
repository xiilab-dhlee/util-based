"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import styled from "styled-components";
import { Card, CardImageContainer } from "xiilab-ui";

import type { FindHubsResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ROUTES } from "@/shared/constants/routes.constant";
import { HUB_SELECTOR, SELECTOR } from "@/shared/constants/selector.constant";

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
  const parsedId = params.id ? Number(params.id) : Number.NaN;
  const selectedHubId = Number.isNaN(parsedId) ? -1 : parsedId;
  const isSelected = selectedHubId === hubId;

  /**
   * 카드 클릭 핸들러
   * 해당 허브 상세 페이지로 이동
   */
  const handleClick = () => {
    if (isSelected) return;

    router.push(ROUTES.USER_HUB_DETAIL(hubId, hubName));
  };

  return (
    <CardWrapper
      type="button"
      data-testid={SELECTOR.LIST_CARD}
      data-hub-id={hubId}
      data-selected={isSelected}
      onClick={handleClick}
    >
      <Card
        hoverable
        title={hubName}
        subtitle={modelType}
        selected={isSelected}
      >
        <CardImageContainer>
          {thumbnail && (
            <ImageWrapper data-testid={HUB_SELECTOR.THUMBNAIL}>
              <Image
                src={`data:image/gif;base64,${thumbnail}`}
                alt="Hub Thumbnail"
                fill
                unoptimized
                draggable={false}
              />
            </ImageWrapper>
          )}
        </CardImageContainer>
        <Description data-testid={HUB_SELECTOR.DESCRIPTION} title={description}>
          {description}
        </Description>
      </Card>
    </CardWrapper>
  );
}

const CardWrapper = styled.button`
  text-align: unset;
  cursor: pointer;

  & * {
    cursor: inherit;
  }
`;

const Description = styled.div`
  font-weight: 400;
  width: 100%;
  font-size: 10px;
  line-height: 12px;
  margin-top: 8px;
  letter-spacing: 0;
  color: #000;

  /* 여러 줄 텍스트 줄임표 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImageWrapper = styled.div`
  height: 66px;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
`;
