"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { RegistryListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRegistryColumn } from "@/domain/registry/components/list/create-registry-column";
import { REGISTRY_SORT_FIELDS } from "@/domain/registry/constants/registry-list.constant";
import {
  registryCheckedListAtom,
  registrySortAtom,
} from "@/domain/registry/state/registry-list.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

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
  const [checkedList, setCheckedList] = useAtom(registryCheckedListAtom);
  const [sort, setSort] = useAtom(registrySortAtom);
  const { rowSelection } = useTableSelection<RegistryListResponse>(
    checkedList,
    setCheckedList,
  );

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
        columns={createRegistryColumn(mode, [
          {
            key: "imageDisplayName",
            title: "컨테이너 이미지 이름",
            align: "left",
            ellipsis: true,
          },
          { key: "imageSourceType" },
          { key: "recentImageTagAndCount" },
          { key: "downloadCount" },
          { key: "creatorName" },
          {
            key: "createdAt",
            sorter: true,
            align: "left",
            sortOrder: getColumnSortOrder(sort, "createdAt"),
          },
        ])}
        data={data}
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        rowKey="harborImageName"
        rowSelection={rowSelection}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
