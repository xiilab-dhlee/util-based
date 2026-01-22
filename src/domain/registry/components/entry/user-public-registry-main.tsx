"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";
import type { TableProps } from "xiilab-ui";

import { useGetPublicImageUsageByAccount } from "@/api/generated/admin-public-registry/admin-public-registry";
import type { PublicImageUsageResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRegistryUserColumn } from "@/domain/registry/components/user-list/create-registry-user-column";
import { USER_REGISTRY_PAGE_SIZE } from "@/domain/registry/constants/registry.constant";
import {
  REGISTRY_USER_SORT_FIELD_MAP,
  REGISTRY_USER_SORT_FIELDS,
} from "@/domain/registry/constants/registry-user-list.constant";
import {
  userPublicRegistryPageAtom,
  userPublicRegistrySearchTextAtom,
  userPublicRegistrySortAtom,
} from "@/domain/registry/state/registry.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import {
  buildSortRequest,
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { UserPublicRegistryFilter } from "./user-public-registry-filter";
import { UserPublicRegistryFooter } from "./user-public-registry-footer";

/**
 * 사용자별 공개 레지스트리 메인 컴포넌트
 * 공개 레지스트리 사용자 목록을 표시합니다.
 */
export function UserPublicRegistryMain() {
  const page = useAtomValue(userPublicRegistryPageAtom);
  const searchText = useAtomValue(userPublicRegistrySearchTextAtom);
  const [sort, setSort] = useAtom(userPublicRegistrySortAtom);

  const resetPage = useResetAtom(userPublicRegistryPageAtom);
  const resetSearchText = useResetAtom(userPublicRegistrySearchTextAtom);
  const resetSort = useResetAtom(userPublicRegistrySortAtom);

  // 마운트 시 상태 초기화
  useEffect(() => {
    resetPage();
    resetSearchText();
    resetSort();
  }, [resetPage, resetSearchText, resetSort]);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: REGISTRY_USER_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetPublicImageUsageByAccount({
    pageSearchRequest: {
      pageNo: page - 1,
      pageSize: USER_REGISTRY_PAGE_SIZE,
      keyword: searchText,
    },
    sortRequest: {
      sort: sortRequest?.sort ?? "ACCOUNT_NAME",
      order: sortRequest?.order ?? "ASC",
    },
  });

  const handleChange: TableProps<PublicImageUsageResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(sorter, REGISTRY_USER_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort(parsed);
  };

  return (
    <>
      <UserPublicRegistryFilter
        totalSize={data?.totalSize}
        loading={isLoading}
      />
      <ListWrapper>
        <CustomizedTable
          columns={createRegistryUserColumn([
            {
              key: "accountName",
              width: "30%",
              sorter: true,
              sortOrder: getColumnSortOrder(sort, "accountName"),
            },
            {
              key: "imageCount",
              width: "35%",
              sorter: true,
              sortOrder: getColumnSortOrder(sort, "imageCount"),
            },
            {
              key: "usedStorage",
              width: "35%",
              sorter: true,
              sortOrder: getColumnSortOrder(sort, "usedStorage"),
            },
          ])}
          data={data?.content || []}
          columnHeight={35}
          loading={isLoading}
          isError={isError}
          tableLayout="fixed"
          scroll={{ x: "100%", y: "100%" }}
          rowKey="accountId"
          activePadding
          onChange={handleChange}
        />
      </ListWrapper>
      <UserPublicRegistryFooter
        totalSize={data?.totalSize || 0}
        isLoading={isLoading}
      />
    </>
  );
}
