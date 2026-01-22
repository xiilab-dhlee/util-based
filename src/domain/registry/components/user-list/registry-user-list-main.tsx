"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect, useRef } from "react";

import { RegistryUserListAside } from "@/domain/registry/components/user-list/registry-user-list-aside";
import { RegistryUserListBody } from "@/domain/registry/components/user-list/registry-user-list-body";
import { RegistryUserListFilter } from "@/domain/registry/components/user-list/registry-user-list-filter";
import { RegistryUserListFooter } from "@/domain/registry/components/user-list/registry-user-list-footer";
import {
  REGISTRY_USER_PAGE_SIZE,
  REGISTRY_USER_SORT_FIELD_MAP,
} from "@/domain/registry/constants/registry-user-list.constant";
import { useGetRegistryUserListByMode } from "@/domain/registry/hooks/use-get-registry-user-list-by-mode";
import {
  registryUserPageAtom,
  registryUserSearchTextAtom,
  registryUserSelectedAccountIdAtom,
  registryUserSortAtom,
  registryUserTagPageAtom,
} from "@/domain/registry/state/registry-user-list.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { buildSortRequest } from "@/shared/utils/sort.util";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

interface RegistryUserListMainProps {
  mode: RegistryMode;
}

export function RegistryUserListMain({ mode }: RegistryUserListMainProps) {
  const resetPage = useResetAtom(registryUserPageAtom);
  const resetSearchText = useSetAtom(registryUserSearchTextAtom);
  const resetSort = useResetAtom(registryUserSortAtom);
  const resetTagPage = useResetAtom(registryUserTagPageAtom);

  const page = useAtomValue(registryUserPageAtom);
  const searchText = useAtomValue(registryUserSearchTextAtom);
  const sort = useAtomValue(registryUserSortAtom);
  const setSelectedAccountId = useSetAtom(registryUserSelectedAccountIdAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: REGISTRY_USER_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetRegistryUserListByMode(mode, {
    pageNo: page - 1,
    pageSize: REGISTRY_USER_PAGE_SIZE,
    keyword: searchText,
    ...(sortRequest
      ? { sort: sortRequest.sort, order: sortRequest.order }
      : {}),
  });

  // 첫 번째 사용자 자동 선택 (최초 1회만)
  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (!isInitializedRef.current && data?.content && data.content.length > 0) {
      setSelectedAccountId(data.content[0].accountId ?? "");
      isInitializedRef.current = true;
    }
  }, [data?.content, setSelectedAccountId]);

  useEffect(() => {
    resetPage();
    resetSearchText("");
    resetSort();
    resetTagPage();
  }, [resetPage, resetSearchText, resetSort, resetTagPage]);

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader pageKey={`admin.${mode}-registry`} />
      {/* 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 목록 페이지 - 왼쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 목록 필터 */}
          <RegistryUserListFilter
            totalSize={data?.totalSize}
            loading={isLoading}
          />
          {/* 목록 본문 */}
          <RegistryUserListBody
            data={data?.content || []}
            isLoading={isLoading}
            isError={isError}
          />
          {/* 목록 페이지네이션 */}
          <RegistryUserListFooter
            totalSize={data?.totalSize || 0}
            isLoading={isLoading}
          />
        </ListPageBody>
        {/* 목록 페이지 - 오른쪽 영역 (사용자별 태그 목록) */}
        <ListPageAside $width={ASIDE_WIDTH}>
          <RegistryUserListAside mode={mode} />
        </ListPageAside>
      </ListPageMain>
    </>
  );
}
