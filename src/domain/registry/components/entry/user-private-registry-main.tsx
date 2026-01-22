"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";
import type { TableProps } from "xiilab-ui";

import { useGetPrivateImageUsageByAccount } from "@/api/generated/admin-private-registry/admin-private-registry";
import type { PrivateImageUsageResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRegistryUserColumn } from "@/domain/registry/components/user-list/create-registry-user-column";
import { USER_REGISTRY_PAGE_SIZE } from "@/domain/registry/constants/registry.constant";
import {
  REGISTRY_USER_SORT_FIELD_MAP,
  REGISTRY_USER_SORT_FIELDS,
} from "@/domain/registry/constants/registry-user-list.constant";
import {
  userPrivateRegistryPageAtom,
  userPrivateRegistrySearchTextAtom,
  userPrivateRegistrySortAtom,
} from "@/domain/registry/state/registry.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import {
  buildSortRequest,
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { UserPrivateRegistryFilter } from "./user-private-registry-filter";
import { UserPrivateRegistryFooter } from "./user-private-registry-footer";

/**
 * 사용자별 개인 레지스트리 메인 컴포넌트
 * 개인 레지스트리 사용자 목록을 표시합니다.
 */
export function UserPrivateRegistryMain() {
  const page = useAtomValue(userPrivateRegistryPageAtom);
  const searchText = useAtomValue(userPrivateRegistrySearchTextAtom);
  const [sort, setSort] = useAtom(userPrivateRegistrySortAtom);

  const resetPage = useResetAtom(userPrivateRegistryPageAtom);
  const resetSearchText = useResetAtom(userPrivateRegistrySearchTextAtom);
  const resetSort = useResetAtom(userPrivateRegistrySortAtom);

  useEffect(() => {
    return () => {
      resetPage();
      resetSearchText();
      resetSort();
    };
  }, [resetPage, resetSearchText, resetSort]);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: REGISTRY_USER_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetPrivateImageUsageByAccount({
    pageNo: page - 1,
    pageSize: USER_REGISTRY_PAGE_SIZE,
    keyword: searchText,
    ...(sortRequest
      ? { sort: sortRequest.sort, order: sortRequest.order }
      : {}),
  });

  const handleChange: TableProps<PrivateImageUsageResponse>["onChange"] = (
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
      <UserPrivateRegistryFilter
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
      <UserPrivateRegistryFooter
        totalSize={data?.totalSize || 0}
        isLoading={isLoading}
      />
    </>
  );
}
