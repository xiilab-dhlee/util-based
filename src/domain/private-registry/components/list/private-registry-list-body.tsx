"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { RegistryListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createPrivateRegistryColumn } from "@/domain/private-registry/components/list/create-private-registry-column";
import { PRIVATE_REGISTRY_SORT_FIELDS } from "@/domain/private-registry/constants/private-registry.constant";
import {
  privateRegistryCheckedListAtom,
  privateRegistrySortAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface PrivateRegistryListBodyProps {
  data: RegistryListResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function PrivateRegistryListBody({
  data,
  isLoading,
  isError,
}: PrivateRegistryListBodyProps) {
  const [checkedList, setCheckedList] = useAtom(privateRegistryCheckedListAtom);
  const [sort, setSort] = useAtom(privateRegistrySortAtom);
  const { rowSelection } = useTableSelection<RegistryListResponse>(
    checkedList,
    setCheckedList,
  );

  const handleChange: TableProps<RegistryListResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(sorter, PRIVATE_REGISTRY_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort(parsed);
  };

  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createPrivateRegistryColumn([
          {
            key: "imageDisplayName",
            title: "컨테이너 이미지 이름",
            // TODO: 백엔드에서 개발 완료시 주석 해제
            // sorter: true,
            // sortOrder: getColumnSortOrder(sort, "imageDisplayName"),
            align: "left",
            width: "20%",
            ellipsis: true,
          },
          { key: "imageSourceType", width: "20%" },
          { key: "recentImageTagAndCount", width: "20%" },
          { key: "downloadCount", width: "20%" },
          {
            key: "createdAt",
            width: "20%",
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
        activePadding
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
