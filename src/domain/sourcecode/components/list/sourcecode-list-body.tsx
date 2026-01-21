"use client";

import { useAtom } from "jotai";
import type { Key } from "react";
import type { TableProps } from "xiilab-ui";

import type { SourceCodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createSourcecodeColumn } from "@/domain/sourcecode/components/list/create-sourcecode-column";
import { SourcecodeRow } from "@/domain/sourcecode/components/sourcecode-row";
import {
  SOURCECODE_SORT_FIELDS,
  type SourcecodeSortField,
} from "@/domain/sourcecode/constants/sourcecode.constant";
import {
  sourcecodeCheckedListAtom,
  sourcecodeSortAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface SourcecodeListBodyProps {
  data: SourceCodeListResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function SourcecodeListBody({
  data,
  isLoading,
  isError,
}: SourcecodeListBodyProps) {
  const [checkedList, setCheckedList] = useAtom(sourcecodeCheckedListAtom);
  const [sort, setSort] = useAtom(sourcecodeSortAtom);

  const { rowSelection } = useTableSelection<SourceCodeListResponse>(
    checkedList as Set<Key>,
    setCheckedList as (value: Set<Key>) => void,
  );

  const handleChange: TableProps<SourceCodeListResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState<
      SourceCodeListResponse,
      SourcecodeSortField
    >(sorter, SOURCECODE_SORT_FIELDS);

    if (!parsed.field || !parsed.order) return;

    setSort({
      field: parsed.field,
      order: parsed.order,
    });
  };

  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createSourcecodeColumn([
          {
            key: "sourceCodeName",
            sortOrder: getColumnSortOrder(sort, "sourceCodeName"),
          },
          { key: "gitUrl" },
          { key: "creatorName" },
          { key: "isPublic" },
          { key: "sourceCodeType" },
          { key: "executionCmd" },
          {
            key: "createdAt",
            align: "left",
            sortOrder: getColumnSortOrder(sort, "createdAt"),
          },
        ])}
        data={data}
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        rowKey="sourceCodeId"
        rowSelection={rowSelection}
        customRow={SourcecodeRow}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
