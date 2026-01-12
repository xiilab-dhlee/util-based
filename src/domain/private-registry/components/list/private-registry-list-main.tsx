"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import { useGetPrivateRegistryList } from "@/api/generated/private-registry/private-registry";
import { CreatePrivateRegistryModal } from "@/domain/private-registry/components/create-private-registry-modal";
import { DeletePrivateRegistryModal } from "@/domain/private-registry/components/delete-private-registry-modal";
import {
  privateregistryCheckedListAtom,
  privateregistryPageAtom,
  privateregistrySearchTextAtom,
  privateregistrySortAtom,
} from "@/domain/private-registry/state/private-registry.atom";
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
  const resetPage = useResetAtom(privateregistryPageAtom);
  const setSearchText = useSetAtom(privateregistrySearchTextAtom);
  const resetCheckedList = useResetAtom(privateregistryCheckedListAtom);

  const page = useAtomValue(privateregistryPageAtom);
  const searchText = useAtomValue(privateregistrySearchTextAtom);
  const sort = useAtomValue(privateregistrySortAtom);

  const { data, isLoading, isError } = useGetPrivateRegistryList({
    pageRequest: {
      pageNo: page - 1,
      pageSize: 20,
      keyword: searchText,
    },
    workspaceFilter: {},
    filterRequest: {
      sort: sort.field,
      order: sort.order,
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
          <PrivateRegistryListFilter
            totalSize={data?.totalSize}
            loading={isLoading}
          />
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
      {/* 프라이빗 레지스트리 이미지 생성 모달 */}
      <CreatePrivateRegistryModal />
      {/* 프라이빗 레지스트리 이미지 삭제 모달 */}
      <DeletePrivateRegistryModal />
    </>
  );
}
