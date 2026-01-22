"use client";

import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import type { TableProps } from "xiilab-ui";

import type { RegistryListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRegistryColumn } from "@/domain/registry/components/list/create-registry-column";
import {
  REGISTRY_SORT_FIELDS,
  type RegistrySortState,
} from "@/domain/registry/constants/registry-list.constant";
import {
  registryCheckedListAtom,
  registrySortAtom,
} from "@/domain/registry/state/registry-list.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { checkIsUser, getSessionAccountId } from "@/shared/utils/auth.util";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * mode에 따른 컬럼 설정 생성
 * - private: creatorName 제외 (5개 컬럼)
 * - public: creatorName 포함 (6개 컬럼)
 */
const getColumnConfig = (
  mode: RegistryMode,
  sort: RegistrySortState,
): CoreCreateColumnConfig[] => {
  const baseColumns: CoreCreateColumnConfig[] = [
    {
      key: "imageDisplayName",
      title: "컨테이너 이미지 이름",
      align: "left",
      width: mode === "private" ? "24%" : "20%",
      ellipsis: true,
    },
    { key: "imageSourceType", width: mode === "private" ? "12%" : "10%" },
    {
      key: "recentImageTagAndCount",
      width: mode === "private" ? "24%" : "20%",
    },
    { key: "downloadCount", width: mode === "private" ? "12%" : "10%" },
  ];

  // public 모드에서만 creatorName 추가
  if (mode === "public") {
    baseColumns.push({ key: "creatorName", width: "20%" });
  }

  // 생성일 컬럼 추가
  baseColumns.push({
    key: "createdAt",
    sorter: true,
    align: "left",
    width: mode === "private" ? "28%" : "20%",
    sortOrder: getColumnSortOrder(sort, "createdAt"),
  });

  return baseColumns;
};

interface RegistryListBodyProps {
  data: RegistryListResponse[];
  isLoading: boolean;
  isError: boolean;
  mode: RegistryMode;
}

export function RegistryListBody({
  data,
  isLoading,
  isError,
  mode,
}: RegistryListBodyProps) {
  const { data: session } = useSession();
  const [checkedList, setCheckedList] = useAtom(registryCheckedListAtom);
  const [sort, setSort] = useAtom(registrySortAtom);
  const { rowSelection } = useTableSelection<RegistryListResponse>(
    checkedList,
    setCheckedList,
  );

  const isUser = checkIsUser(session);
  const sessionAccountId = getSessionAccountId(session);

  const rowSelectionWithDisabled: TableProps<RegistryListResponse>["rowSelection"] =
    {
      ...rowSelection,
      getCheckboxProps: (record: RegistryListResponse) => ({
        disabled: isUser && record.creatorId !== sessionAccountId,
      }),
    };

  const handleChange: TableProps<RegistryListResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(sorter, REGISTRY_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort(parsed);
  };

  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createRegistryColumn(mode, getColumnConfig(mode, sort))}
        data={data}
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        tableLayout="fixed"
        scroll={{ x: "100%", y: "100%" }}
        rowKey="imageId"
        rowSelection={rowSelectionWithDisabled}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
