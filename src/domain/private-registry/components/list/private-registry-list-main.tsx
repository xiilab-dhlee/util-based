"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import { useGetPrivateRegistryList } from "@/api/generated/private-registry/private-registry";
import { CreatePrivateRegistryModal } from "@/domain/private-registry/components/create-private-registry-modal";
import { DeletePrivateRegistryModal } from "@/domain/private-registry/components/delete-private-registry-modal";
import { PrivateRegistryListAside } from "@/domain/private-registry/components/list/private-registry-list-aside";
import { PrivateRegistryListBody } from "@/domain/private-registry/components/list/private-registry-list-body";
import { PrivateRegistryListFilter } from "@/domain/private-registry/components/list/private-registry-list-filter";
import { PrivateRegistryListFooter } from "@/domain/private-registry/components/list/private-registry-list-footer";
import { RestartPrivateRegistryModal } from "@/domain/private-registry/components/restart-private-registry-modal";
import { SelectPrivateRegistryTypeModal } from "@/domain/private-registry/components/select-private-registry-type-modal";
import { StopPrivateRegistryModal } from "@/domain/private-registry/components/stop-private-registry-modal";
import {
  PRIVATE_REGISTRY_PAGE_SIZE,
  PRIVATE_REGISTRY_SORT_FIELD_MAP,
} from "@/domain/private-registry/constants/private-registry.constant";
import {
  privateRegistryCheckedListAtom,
  privateRegistryImageSourceTypeAtom,
  privateRegistryPageAtom,
  privateRegistrySearchTextAtom,
  privateRegistrySortAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

export function PrivateRegistryListMain() {
  const resetPage = useResetAtom(privateRegistryPageAtom);
  const resetSearchText = useResetAtom(privateRegistrySearchTextAtom);
  const resetSort = useResetAtom(privateRegistrySortAtom);
  const resetCheckedList = useResetAtom(privateRegistryCheckedListAtom);
  const resetImageSourceType = useResetAtom(privateRegistryImageSourceTypeAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const page = useAtomValue(privateRegistryPageAtom);
  const searchText = useAtomValue(privateRegistrySearchTextAtom);
  const sort = useAtomValue(privateRegistrySortAtom);
  const imageSourceType = useAtomValue(privateRegistryImageSourceTypeAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: PRIVATE_REGISTRY_SORT_FIELD_MAP,
  });
  const { data, isLoading, isError } = useGetPrivateRegistryList(
    {
      pageNo: page - 1,
      pageSize: PRIVATE_REGISTRY_PAGE_SIZE,
      keyword: searchText,
      imageSourceType,
      workspaceId: selectedWorkspace?.workspaceId,
      ...(sortRequest
        ? { sort: sortRequest.sort, order: sortRequest.order }
        : {}),
    },
    {
      query: {
        enabled: !!selectedWorkspace?.workspaceId,
      },
    },
  );

  useEffect(() => {
    resetPage();
    resetSearchText();
    resetSort();
    resetCheckedList();
    resetImageSourceType();
  }, [
    resetPage,
    resetSearchText,
    resetSort,
    resetCheckedList,
    resetImageSourceType,
  ]);

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
        <ListPageAside $width={ASIDE_WIDTH}>
          <PrivateRegistryListAside />
        </ListPageAside>
      </ListPageMain>
      {/* 프라이빗 레지스트리 구분 선택 모달 */}
      <SelectPrivateRegistryTypeModal />
      {/* 프라이빗 레지스트리 이미지 생성 모달 */}
      <CreatePrivateRegistryModal />
      {/* 프라이빗 레지스트리 이미지 삭제 모달 */}
      <DeletePrivateRegistryModal />
      {/* 컨테이너 이미지 등록 재시작 모달 */}
      <RestartPrivateRegistryModal />
      {/* 컨테이너 이미지 등록 종료 모달 */}
      <StopPrivateRegistryModal />
    </>
  );
}
