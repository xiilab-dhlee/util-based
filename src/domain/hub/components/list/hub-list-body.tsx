"use client";

import type { FindHubsResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { HubCard } from "@/domain/hub/components/list/hub-card";
import { ListEmpty } from "@/shared/components/layouts/list-empty";
import { MySpinner } from "@/shared/components/spinner";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface HubListBodyProps {
  content: FindHubsResponse[];
  loading: boolean;
  isError?: boolean;
}

/**
 * HubListBody 컴포넌트
 *
 * 허브 목록 페이지의 본문 컴포넌트입니다.
 * 허브 데이터를 그리드 형태로 표시합니다.
 *
 * @param content - 허브 목록 데이터
 * @param loading - 로딩 여부
 * @param isError - 에러 상태 여부
 */
export function HubListBody({
  content,
  loading,
  isError = false,
}: HubListBodyProps) {
  // 1. 로딩 상태
  if (loading) {
    return (
      <ListWrapper>
        <MySpinner />
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
          message="허브을 생성하여 사용해보세요."
        />
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <GridList>
        {content.map((hub) => (
          <HubCard key={hub.hubId} {...hub} />
        ))}
      </GridList>
    </ListWrapper>
  );
}
