"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import {
  RegistryImageFilterRequestOrder,
  RegistryImageFilterRequestSort,
  type RegistryListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  privateregistryCheckedListAtom,
  privateregistrySortAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { createPrivateRegistryColumn } from "@/shared/components/column/create-private-registry-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
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

    // Antd의 order 값을 API의 Order 타입으로 변환
    const apiOrder =
      parsed.order === "ascend"
        ? RegistryImageFilterRequestOrder.ASC
        : RegistryImageFilterRequestOrder.DESC;

    // dataIndex를 API의 Sort 타입으로 변환
    const apiSort =
      parsed.field === "imageDisplayName"
        ? RegistryImageFilterRequestSort.IMAGE_NAME
        : RegistryImageFilterRequestSort.CREATED_AT;

    setSort({
      field: apiSort,
      order: apiOrder,
    });
  };

  // API의 order 값을 Antd의 order 값으로 변환
  const getAntdOrder = (
    apiOrder: RegistryImageFilterRequestOrder,
  ): "ascend" | "descend" => {
    return apiOrder === RegistryImageFilterRequestOrder.ASC
      ? "ascend"
      : "descend";
  };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createPrivateRegistryColumn([
          {
            dataIndex: "imageDisplayName",
            title: "컨테이너 이미지 이름",
            sorter: true,
            sortOrder:
              sort.field === RegistryImageFilterRequestSort.IMAGE_NAME
                ? getAntdOrder(sort.order)
                : null,
            width: "20%",
          },
          { dataIndex: "imageType", width: "20%" },
          { dataIndex: "recentImageTagAndCount", width: "20%" },
          { dataIndex: "downloadCount", width: "20%" },
          {
            dataIndex: "createdAt",
            sorter: true,
            sortOrder:
              sort.field === RegistryImageFilterRequestSort.CREATED_AT
                ? getAntdOrder(sort.order)
                : null,
            width: "20%",
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
