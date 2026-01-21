"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";

import { CreateRegistryModal } from "@/domain/registry/components/create-registry-modal";
import { DeleteRegistryModal } from "@/domain/registry/components/delete-registry-modal";
import { RegistryListAside } from "@/domain/registry/components/list/registry-list-aside";
import { RegistryListBody } from "@/domain/registry/components/list/registry-list-body";
import { RegistryListFilter } from "@/domain/registry/components/list/registry-list-filter";
import { RegistryListFooter } from "@/domain/registry/components/list/registry-list-footer";
import { RestartRegistryModal } from "@/domain/registry/components/restart-registry-modal";
import { SelectRegistryTypeModal } from "@/domain/registry/components/select-registry-type-modal";
import { StopRegistryModal } from "@/domain/registry/components/stop-registry-modal";
import {
  REGISTRY_PAGE_SIZE,
  REGISTRY_SORT_FIELD_MAP,
} from "@/domain/registry/constants/registry-list.constant";
import { useGetRegistryListByMode } from "@/domain/registry/hooks/use-get-registry-list-by-mode";
import {
  registryCheckedListAtom,
  registryImageSourceTypeAtom,
  registryPageAtom,
  registrySearchTextAtom,
  registrySortAtom,
} from "@/domain/registry/state/registry-list.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

interface RegistryListMainProps {
  mode: RegistryMode;
}

export function RegistryListMain({ mode }: RegistryListMainProps) {
  const resetPage = useResetAtom(registryPageAtom);
  const resetSearchText = useResetAtom(registrySearchTextAtom);
  const resetSort = useResetAtom(registrySortAtom);
  const resetCheckedList = useResetAtom(registryCheckedListAtom);
  const resetImageSourceType = useResetAtom(registryImageSourceTypeAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const page = useAtomValue(registryPageAtom);
  const searchText = useAtomValue(registrySearchTextAtom);
  const sort = useAtomValue(registrySortAtom);
  const imageSourceType = useAtomValue(registryImageSourceTypeAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: REGISTRY_SORT_FIELD_MAP,
  });
  const { data, isLoading, isError } = useGetRegistryListByMode(
    mode,
    {
      pageNo: page - 1,
      pageSize: REGISTRY_PAGE_SIZE,
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
      <PageHeader pageKey={`user.${mode}-registry`} />
      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 목록 필터 */}
          <RegistryListFilter totalSize={data?.totalSize} loading={isLoading} />
          {/* 목록 본문 */}
          <RegistryListBody
            data={data?.content || []}
            isLoading={isLoading}
            isError={isError}
            mode={mode}
          />
          {/* 목록 페이지네이션 */}
          <RegistryListFooter
            totalSize={data?.totalSize || 0}
            isLoading={isLoading}
          />
        </ListPageBody>
        {/* 목록 페이지 - 오른쪽 영역 */}
        <ListPageAside $width={ASIDE_WIDTH}>
          <RegistryListAside />
        </ListPageAside>
      </ListPageMain>
      {/* 프라이빗 레지스트리 구분 선택 모달 */}
      <SelectRegistryTypeModal />
      {/* 프라이빗 레지스트리 이미지 생성 모달 */}
      <CreateRegistryModal mode={mode} />
      {/* 레지스트리 이미지 삭제 모달 */}
      <DeleteRegistryModal mode={mode} />
      {/* 컨테이너 이미지 등록 재시작 모달 */}
      <RestartRegistryModal />
      {/* 컨테이너 이미지 등록 종료 모달 */}
      <StopRegistryModal />
    </>
  );
}
