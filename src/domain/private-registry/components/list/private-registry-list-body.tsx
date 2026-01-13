"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { RegistryListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { PrivateRegistrySortField } from "@/domain/private-registry/constants/private-registry.constant";
import {
  privateregistryCheckedListAtom,
  privateregistrySortAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { createPrivateRegistryColumn } from "@/shared/components/column/create-private-registry-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
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
  const [checkedList, setCheckedList] = useAtom(privateregistryCheckedListAtom);
  const [sort, setSort] = useAtom(privateregistrySortAtom);
  const { rowSelection } = useTableSelection<RegistryListResponse>(
    checkedList,
    setCheckedList,
  );

  const handleChange: TableProps<RegistryListResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(sorter);
    if (!parsed.field || !parsed.order) return;

    setSort({
      field: parsed.field as PrivateRegistrySortField,
      order: parsed.order,
    });
  };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createPrivateRegistryColumn([
          {
            dataIndex: "imageDisplayName",
            title: "컨테이너 이미지 이름",
            // TODO: 백엔드에서 개발 완료시 주석 해제
            // sorter: true,
            // sortOrder: getColumnSortOrder(sort, "imageDisplayName"),
            align: "left",
            width: "20%",
            ellipsis: true,
          },
          { dataIndex: "imageType", width: "20%" },
          { dataIndex: "recentImageTagAndCount", width: "20%" },
          { dataIndex: "downloadCount", width: "20%" },
          {
            dataIndex: "createdAt",
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
        rowKey="imageId"
        rowSelection={rowSelection}
        activePadding
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
