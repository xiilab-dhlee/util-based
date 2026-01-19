"use client";

import { Card } from "xiilab-ui";

import type { FindHubsResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { HubCard } from "@/domain/hub/components/hub-card";
import {
  HUB_CARD_HEIGHT,
  HUB_PAGE_SIZE,
} from "@/domain/hub/constants/hub.constant";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface HubListBodyProps {
  content: FindHubsResponse[];
  loading: boolean;
  isError?: boolean;
}

export function HubListBody({
  content,
  loading,
  isError = false,
}: HubListBodyProps) {
  // 1. 로딩 상태 - 스켈레톤 카드 표시
  if (loading) {
    return (
      <ListWrapper>
        <GridList>
          {Array.from({ length: HUB_PAGE_SIZE }).map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              loading
              style={{ height: HUB_CARD_HEIGHT }}
            />
          ))}
        </GridList>
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
      <GridList data-testid={SELECTOR.LIST_CARD_GRID} role="listbox">
        {content.map((hub) => (
          <HubCard key={hub.hubId} {...hub} />
        ))}
      </GridList>
    </ListWrapper>
  );
}
