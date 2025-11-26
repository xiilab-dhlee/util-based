"use client";

import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { InternalRegistryListAside } from "./internal-registry-list-aside";
import { InternalRegistryListBody } from "./internal-registry-list-body";
import { InternalRegistryListFilter } from "./internal-registry-list-filter";
import { InternalRegistryListFooter } from "./internal-registry-list-footer";

export function InternalRegistryListMain() {
  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        pageKey="admin.internal-registry"
        description="Internal Registry"
      />
      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 목록 필터 */}
          <InternalRegistryListFilter />
          {/* 목록 본문 */}
          <InternalRegistryListBody />
          {/* 목록 페이지네이션 */}
          <InternalRegistryListFooter />
        </ListPageBody>
        {/* 목록 페이지 - 오른쪽 영역 */}
        <InternalRegistryListAside />
      </ListPageMain>
    </>
  );
}
