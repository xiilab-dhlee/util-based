"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { PrivateImageUsageResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRegistryUserColumn } from "@/domain/registry/components/user-list/create-registry-user-column";
import { RegistryUserRow } from "@/domain/registry/components/user-list/registry-user-row";
import { REGISTRY_USER_SORT_FIELDS } from "@/domain/registry/constants/registry-user-list.constant";
import { registryUserSortAtom } from "@/domain/registry/state/registry-user-list.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface RegistryUserListBodyProps {
  data: PrivateImageUsageResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function RegistryUserListBody({
  data,
  isLoading,
  isError,
}: RegistryUserListBodyProps) {
  const [sort, setSort] = useAtom(registryUserSortAtom);

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
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
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
        data={data}
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        tableLayout="fixed"
        scroll={{ x: "100%", y: "100%" }}
        rowKey="accountId"
        activePadding
        customRow={RegistryUserRow}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
