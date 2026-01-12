"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import {
  RegistryImageFilterRequestOrder,
  RegistryImageFilterRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetPrivateRegistryList } from "@/api/generated/private-registry/private-registry";
import {
  privateregistryCheckedListAtom,
  privateregistryPageAtom,
  privateregistrySearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { PrivateRegistryListAside } from "./private-registry-list-aside";
import { PrivateRegistryListBody } from "./private-registry-list-body";
import { PrivateRegistryListFilter } from "./private-registry-list-filter";
import { PrivateRegistryListFooter } from "./private-registry-list-footer";

export function PrivateRegistryListMain() {
  const resetPage = useResetAtom(privateregistryPageAtom);
  const setSearchText = useSetAtom(privateregistrySearchTextAtom);
  const resetCheckedList = useResetAtom(privateregistryCheckedListAtom);

  const page = useAtomValue(privateregistryPageAtom);
  const searchText = useAtomValue(privateregistrySearchTextAtom);

  const { data, isLoading, isError } = useGetPrivateRegistryList({
    pageRequest: {
      pageNo: page - 1,
      pageSize: LIST_PAGE_SIZE,
      keyword: searchText,
    },
    workspaceFilter: {},
    filterRequest: {
      sort: RegistryImageFilterRequestSort.CREATED_AT,
      order: RegistryImageFilterRequestOrder.DESC,
      isMine: false,
    },
  });

  useEffect(() => {
    resetPage();
    setSearchText("");
    resetCheckedList();
  }, [resetPage, setSearchText, resetCheckedList]);

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader pageKey="user.private-registry" />
      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 목록 필터 */}
          <PrivateRegistryListFilter totalSize={data?.totalSize} />
          {/* 목록 본문 */}
          <PrivateRegistryListBody
            data={data?.content || []}
            isLoading={isLoading}
            isError={isError}
          />
          {/* 목록 페이지네이션 */}
          <PrivateRegistryListFooter
            totalSize={data?.totalSize || 0}
            isLoading={isLoading}
          />
        </ListPageBody>
        {/* 목록 페이지 - 오른쪽 영역 */}
        <PrivateRegistryListAside />
      </ListPageMain>
    </>
  );
}
