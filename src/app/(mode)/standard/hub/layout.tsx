import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { HubListBody } from "@/components/hub/list/hub-list-body";
import { HubListFilter } from "@/components/hub/list/hub-list-filter";
import { HubListFooter } from "@/components/hub/list/hub-list-footer";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

export const metadata: Metadata = {
  title: "Hub",
};

export default function HubLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader
        title="허브"
        icon="Hub"
        description="Hub"
        breadcrumbKey="standard.hub"
      />
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
