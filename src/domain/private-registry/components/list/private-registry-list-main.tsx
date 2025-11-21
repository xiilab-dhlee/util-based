"use client";

import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { PrivateRegistryListAside } from "./private-registry-list-aside";
import { PrivateRegistryListBody } from "./private-registry-list-body";
import { PrivateRegistryListFilter } from "./private-registry-list-filter";
import { PrivateRegistryListFooter } from "./private-registry-list-footer";

export function PrivateRegistryListMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        pageKey="admin.private-registry"
        description="Private Registry"
      />
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
