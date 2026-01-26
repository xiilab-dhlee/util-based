"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { AdminResourceRequestListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  REQUEST_RESOURCE_SORT_FIELDS,
  type RequestResourceSortField,
} from "@/domain/request-resource/constants/request-resource.constant";
import { requestResourceSortAtom } from "@/domain/request-resource/state/request-resource.atom";
import { createRequestResourceColumn } from "@/shared/components/column/create-request-resource-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface RequestResourceBodyProps {
  data: AdminResourceRequestListResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function RequestResourceBody({
  data,
  isLoading,
  isError,
}: RequestResourceBodyProps) {
  const [sort, setSort] = useAtom(requestResourceSortAtom);

  const handleChange: TableProps<AdminResourceRequestListResponse>["onChange"] =
    (_, __, sorter) => {
      const parsed = parseSorterToAntdState<
        AdminResourceRequestListResponse,
        RequestResourceSortField
      >(sorter, REQUEST_RESOURCE_SORT_FIELDS);
      if (!parsed.order) return;

      setSort((prev) => ({
        ...prev,
        order: parsed.order,
        field: parsed.field,
      }));
    };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createRequestResourceColumn(sort)}
        data={data}
        activePadding
        loading={isLoading}
        isError={isError}
        onChange={handleChange}
        rowKey="resourceRequestId"
      />
    </ListWrapper>
  );
}
