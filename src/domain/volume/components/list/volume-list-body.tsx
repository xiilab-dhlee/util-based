"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { VolumeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { VolumeCard } from "@/domain/volume/components/volume-card";
import {
  VOLUME_CARD_HEIGHT,
  VOLUME_PAGE_SIZE,
} from "@/domain/volume/constants/volume.constant";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface VolumeListBodyProps {
  content: VolumeListResponse[];
  loading: boolean;
  isError?: boolean;
}

export function VolumeListBody({
  content,
  loading,
  isError = false,
}: VolumeListBodyProps) {
  // 1. 로딩 상태 - 스켈레톤 카드 표시
  if (loading) {
    return (
      <ListWrapper>
        <StyledGridList>
          {Array.from({ length: VOLUME_PAGE_SIZE }).map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              loading
              style={{ height: VOLUME_CARD_HEIGHT }}
            />
          ))}
        </StyledGridList>
      </ListWrapper>
    );
  }

  // 2. 에러 상태
  if (isError) {
    return (
      <ListWrapper>
        <EmptyState title={TABLE_MESSAGE.ERROR} />
      </ListWrapper>
    );
  }

  // 3. 빈 목록 상태
  if (content.length === 0) {
    return (
      <ListWrapper>
        <EmptyState />
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <StyledGridList data-testid={SELECTOR.LIST_CARD_GRID} role="listbox">
        {content.map((volume) => (
          <VolumeCard key={volume.volumeId} {...volume} />
        ))}
      </StyledGridList>
    </ListWrapper>
  );
}

const StyledGridList = styled(GridList)`
  position: relative;

  --icon-fill: #5b29c7;
`;
