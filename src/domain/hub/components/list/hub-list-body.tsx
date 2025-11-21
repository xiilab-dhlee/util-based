"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { useGetHubs } from "@/domain/hub/hooks/use-get-hubs";
import type { HubListType } from "@/domain/hub/schemas/hub.schema";
import {
  hubPageAtom,
  hubSearchTextAtom,
  hubSelectedAtom,
} from "@/domain/hub/state/hub.atom";
import { CARD_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListEmpty } from "@/shared/components/layouts/list-empty";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { HubCard } from "./hub-card";

/**
 * HubListBody 컴포넌트
 *
 * 허브 목록 페이지의 본문 컴포넌트입니다.
 * 허브 데이터를 그리드 형태로 표시하며, 페이지네이션과 검색 기능을 지원합니다.
 * 데이터 로드 시 첫 번째 허브를 자동으로 선택하여 사이드바에 상세 정보를 표시합니다.
 *
 * @returns 허브 목록을 그리드로 표시하는 본문 컴포넌트 JSX 요소
 */
export function HubListBody() {
  // 현재 페이지 번호 (Jotai atom에서 관리)
  const page = useAtomValue(hubPageAtom);

  // 검색 텍스트 (Jotai atom에서 관리)
  const searchText = useAtomValue(hubSearchTextAtom);

  // 선택된 허브 ID (Jotai atom에서 관리)
  const setSelectedHub = useSetAtom(hubSelectedAtom);

  // 허브 목록 데이터 조회 (React Query 훅 사용)
  const { data } = useGetHubs({
    page,
    size: CARD_PAGE_SIZE,
    searchText,
  });

  /**
   * 데이터 변경 시 첫 번째 허브 자동 선택
   * 허브 목록이 로드되면 첫 번째 허브를 자동으로 선택하여
   * 사이드바에 해당 허브의 상세 정보를 표시합니다.
   */
  useEffect(() => {
    const firstHub = data?.content[0];
    if (firstHub) {
      setSelectedHub(firstHub.id);
    }
  }, [data, setSelectedHub]);

  return (
    <ListWrapper>
      <GridList>
        {data?.content.length === 0 && (
          <ListEmpty
            title="허브가 없습니다."
            message="허브을 생성하여 사용해보세요."
          />
        )}
        {data?.content.map((hub: HubListType) => (
          <HubCard key={hub.id} {...hub} />
        ))}
      </GridList>
    </ListWrapper>
  );
}
