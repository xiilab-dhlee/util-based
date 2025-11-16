import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { HubListBody } from "@/components/hub/list/hub-list-body";
import { HubListFilter } from "@/components/hub/list/hub-list-filter";
import { HubListFooter } from "@/components/hub/list/hub-list-footer";
import { STANDARD_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  STANDARD_ROOT_BREADCRUMB_ITEM,
  { title: "허브" },
];

export const metadata: Metadata = {
  title: "Hub",
};

export default function HubLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader title="허브" icon="Hub" description="Hub">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      <ListPageMain>
        <ListPageBody>
          {/* 허브 목록 필터 */}
          <HubListFilter />
          {/* 허브 목록 본문 */}
          <HubListBody />
          {/* 허브 목록 페이지네이션 */}
          <HubListFooter />
        </ListPageBody>
        {children}
      </ListPageMain>
    </>
  );
}
