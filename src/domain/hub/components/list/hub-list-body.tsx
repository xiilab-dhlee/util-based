"use client";

import { Card } from "xiilab-ui";

import type { FindHubsResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { HubCard } from "@/domain/hub/components/hub-card";
import { HUB_PAGE_SIZE } from "@/domain/hub/constants/hub.constant";
import { ListEmpty } from "@/shared/components/layouts/list-empty";
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
            <Card key={`skeleton-${index}`} loading style={{ height: 151 }} />
          ))}
        </GridList>
      </ListWrapper>
    );
  }

  // 2. 에러 상태
  if (isError) {
    return (
      <ListWrapper>
        <ListEmpty
          title="오류가 발생했습니다."
          message="잠시 후 다시 시도해 주세요."
        />
      </ListWrapper>
    );
  }

  // 3. 빈 목록 상태
  if (content.length === 0) {
    return (
      <ListWrapper>
        <ListEmpty
          title="허브가 없습니다."
          message="허브를 생성하여 사용해보세요."
        />
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <GridList data-testid={SELECTOR.LIST_CARD_GRID}>
        {content.map((hub) => (
          <HubCard key={hub.hubId} {...hub} />
        ))}
      </GridList>
    </ListWrapper>
  );
}
