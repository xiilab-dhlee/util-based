"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { AsideHub } from "@/domain/hub/components/detail/aside-hub";
import { HubListBody } from "@/domain/hub/components/list/hub-list-body";
import { HubListFilter } from "@/domain/hub/components/list/hub-list-filter";
import { HubListFooter } from "@/domain/hub/components/list/hub-list-footer";
import { useGetHubs } from "@/domain/hub/hooks/use-get-hubs";
import {
  hubPageAtom,
  hubSearchTextAtom,
  hubSelectedAtom,
} from "@/domain/hub/state/hub.atom";
import { CreateWorkloadDrawer } from "@/shared/components/drawer/create-workload-drawer";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH, CARD_PAGE_SIZE } from "@/shared/constants/core.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

export function HubListMain() {
  // 1. 전역 상태에서 필터 값 읽기
  const page = useAtomValue(hubPageAtom);
  const searchText = useAtomValue(hubSearchTextAtom);
  const setSelectedHub = useSetAtom(hubSelectedAtom);

  // 2. Main에서 API 호출
  const { data, isLoading } = useGetHubs({
    page,
    size: CARD_PAGE_SIZE,
    searchText,
  });

  // 데이터 변경 시 첫 번째 허브 자동 선택
  useEffect(() => {
    const firstHub = data?.content[0];
    if (firstHub) {
      setSelectedHub(firstHub.id);
    }
  }, [data, setSelectedHub]);

  // 3. 하위 컴포넌트에 props 전달
  return (
    <>
      <PageHeader pageKey="user.hub" description="Hub" />
      <ListPageMain>
        <ListPageBody>
          {/* 허브 목록 필터 */}
          <HubListFilter total={data?.totalSize || 0} loading={isLoading} />
          {/* 허브 목록 본문 */}
          <HubListBody content={data?.content || []} loading={isLoading} />
          {/* 허브 목록 페이지네이션 */}
          <HubListFooter total={data?.totalSize || 0} loading={isLoading} />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>
          <AsideHub />
        </ListPageAside>
      </ListPageMain>
      {/* 워크로드 생성 드로어 */}
      <CreateWorkloadDrawer />
    </>
  );
}
