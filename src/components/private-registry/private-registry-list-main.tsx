"use client";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import PrivateRegistryListAside from "./private-registry-list-aside";
import PrivateRegistryListBody from "./private-registry-list-body";
import PrivateRegistryListFilter from "./private-registry-list-filter";
import PrivateRegistryListFooter from "./private-registry-list-footer";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  {
    title: "레지스트리",
    href: "/admin/registry",
  },
  { title: "내부 레지스트리" },
];

export function PrivateRegistryListMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="내부 레지스트리"
        icon="PrivateRegistry"
        description="Private Registry"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 목록 필터 */}
          <PrivateRegistryListFilter />
          {/* 목록 본문 */}
          <PrivateRegistryListBody />
          {/* 목록 페이지네이션 */}
          <PrivateRegistryListFooter />
        </ListPageBody>
        {/* 목록 페이지 - 오른쪽 영역 */}
        <PrivateRegistryListAside />
      </ListPageMain>
    </>
  );
}
