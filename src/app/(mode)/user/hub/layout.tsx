"use client";

import { useAtom, useAtomValue } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";

import { useFindHubs } from "@/api/generated/hub/hub";
import { HubListBody } from "@/domain/hub/components/list/hub-list-body";
import { HubListFilter } from "@/domain/hub/components/list/hub-list-filter";
import { HUB_PAGE_SIZE } from "@/domain/hub/constants/hub.constant";
import { hubPageAtom, hubSearchTextAtom } from "@/domain/hub/state/hub.atom";
import { CreateWorkloadDrawer } from "@/shared/components/drawer/create-workload-drawer";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

/**
 * Hub 페이지 공통 레이아웃
 *
 * Notification 패턴을 따라 공통 레이아웃을 정의하고
 * children 슬롯을 통해 list/detail aside 컨텐츠를 렌더링합니다.
 *
 * - /user/hub → HubListMain (자동 리다이렉트 로직 포함)
 * - /user/hub/[id] → HubDetailMain (URL 파라미터 기반)
 */
export default function UserHubLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const [page, setPage] = useAtom(hubPageAtom);
  const searchText = useAtomValue(hubSearchTextAtom);
  const pathname = usePathname();
  const isHubListPage = pathname === ROUTES.USER_HUB;

  const { data, isLoading, isError } = useFindHubs({
    pageNo: page - 1,
    pageSize: HUB_PAGE_SIZE,
    keyword: searchText || undefined,
  });

  // orval 응답에서 데이터 추출 (customInstance가 BaseResponse.data를 자동 언랩)
  const content = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  // 목록 페이지에서만 첫 번째 허브로 자동 리다이렉트
  useEffect(() => {
    if (content.length === 0) return;

    if (isHubListPage && content[0]) {
      router.push(ROUTES.USER_HUB_DETAIL(content[0].hubId));
    }
  }, [isHubListPage, content, router]);

  return (
    <>
      <PageHeader pageKey="user.hub" description="Hub" />
      <ListPageMain>
        <ListPageBody>
          <HubListFilter total={totalSize} loading={isLoading} />
          <HubListBody
            content={content}
            loading={isLoading}
            isError={isError}
          />
          <ListPageFooter
            total={totalSize}
            page={page}
            pageSize={HUB_PAGE_SIZE}
            onChange={setPage}
            isLoading={isLoading}
          />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>{children}</ListPageAside>
      </ListPageMain>
      {/* 워크로드 생성 드로어 */}
      <CreateWorkloadDrawer />
    </>
  );
}
