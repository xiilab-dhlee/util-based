"use client";

import { HubCard } from "@/domain/hub/components/list/hub-card";
import type { HubListType } from "@/domain/hub/schemas/hub.schema";
import { ListEmpty } from "@/shared/components/layouts/list-empty";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface HubListBodyProps {
  content: HubListType[];
  loading: boolean;
}

/**
 * HubListBody 컴포넌트
 *
 * 허브 목록 페이지의 본문 컴포넌트입니다.
 * 허브 데이터를 그리드 형태로 표시합니다.
 */
export function HubListBody({ content, loading }: HubListBodyProps) {
  return (
    <ListWrapper>
      <GridList>
        {content.length === 0 && !loading && (
          <ListEmpty
            title="허브가 없습니다."
            message="허브을 생성하여 사용해보세요."
          />
        )}
        {content.map((hub: HubListType) => (
          <HubCard key={hub.id} {...hub} />
        ))}
      </GridList>
    </ListWrapper>
  );
}
