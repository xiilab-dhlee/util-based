import type { PropsWithChildren } from "react";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { HubListBody } from "@/components/hub/list/hub-list-body";
import { HubListFilter } from "@/components/hub/list/hub-list-filter";
import { HubListFooter } from "@/components/hub/list/hub-list-footer";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/standard",
  },
  { title: "허브" },
];

/**
 * 볼륨 목록 페이지 레이아웃
 */
export default function HubLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader title="허브" icon="Hub" description="Hub">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      {/* 볼륨 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 볼륨 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 볼륨 목록 필터 */}
          <HubListFilter />
          {/* 볼륨 목록 본문 */}
          <HubListBody />
          {/* 볼륨 목록 페이지네이션 */}
          <HubListFooter />
        </ListPageBody>
        {children}
      </ListPageMain>
    </>
  );
}
