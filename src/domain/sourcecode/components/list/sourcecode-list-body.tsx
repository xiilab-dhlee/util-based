"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";
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
  sourcecodePageAtom,
  sourcecodeSortAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import { getSessionAccountId } from "@/shared/utils/auth.util";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface SourcecodeListBodyProps {
  data: SourceCodeListResponse[];
  isLoading: boolean;
  isError: boolean;
  mode: SourcecodeMode;
}

export function SourcecodeListBody({
  data,
  isLoading,
  isError,
  mode,
}: SourcecodeListBodyProps) {
  const { data: session } = useSession();
  const [checkedList, setCheckedList] = useAtom(sourcecodeCheckedListAtom);
  const [sort, setSort] = useAtom(sourcecodeSortAtom);
  const resetPage = useResetAtom(sourcecodePageAtom);
  const resetCheckedList = useResetAtom(sourcecodeCheckedListAtom);

  const { rowSelection } = useTableSelection<SourceCodeListResponse>(
    checkedList,
    setCheckedList,
  );

  const isUser = mode === "user";
  const sessionAccountId = getSessionAccountId(session);

  const rowSelectionWithDisabled: TableProps<SourceCodeListResponse>["rowSelection"] =
    {
      ...rowSelection,
      getCheckboxProps: (record: SourceCodeListResponse) => ({
        disabled: isUser && record.creatorId !== sessionAccountId,
      }),
    };

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

    resetPage();
    resetCheckedList();
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
            width: "18%",
            ellipsis: true,
            sorter: true,
            sortOrder: getColumnSortOrder(sort, "sourceCodeName"),
          },
          { key: "gitUrl", width: "22%", ellipsis: true },
          { key: "isPublic", width: "8%" },
          { key: "sourceCodeType", width: "10%" },
          { key: "executionCmd", width: "16%", ellipsis: true },
          { key: "creatorName", width: "10%" },
          {
            key: "createdAt",
            width: "16%",
            align: "left",
            sorter: true,
            sortOrder: getColumnSortOrder(sort, "createdAt"),
          },
        ])}
        data={data}
        columnHeight={32}
        loading={isLoading}
        isError={isError}
        tableLayout="fixed"
        scroll={{ x: "100%", y: "100%" }}
        rowKey="sourceCodeId"
        rowSelection={rowSelectionWithDisabled}
        customRow={SourcecodeRow}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
