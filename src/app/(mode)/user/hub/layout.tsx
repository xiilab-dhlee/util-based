import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { HubListBody } from "@/domain/hub/components/list/hub-list-body";
import { HubListFilter } from "@/domain/hub/components/list/hub-list-filter";
import { HubListFooter } from "@/domain/hub/components/list/hub-list-footer";
import { CreateWorkloadDrawer } from "@/shared/components/drawer/create-workload-drawer";
import { PageHeader } from "@/shared/components/layouts/page-header";
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
      <PageHeader pageKey="user.hub" description="Hub" />
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
      {/* 워크로드 생성 드로어 */}
      <CreateWorkloadDrawer />
    </>
  );
}
