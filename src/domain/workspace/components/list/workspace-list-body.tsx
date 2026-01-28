"use client";

import { useAtom, useAtomValue } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { AdminWorkspaceDetailItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  WORKSPACE_SORT_FIELDS,
  type WorkspaceSortField,
} from "@/domain/workspace/constants/workspace.constant";
import { useWorkspaceListReset } from "@/domain/workspace/hooks/use-workspace-list-reset";
import {
  workspaceCheckedListAtom,
  workspaceSortAtom,
} from "@/domain/workspace/state/workspace.atom";
import { createWorkspaceColumn } from "@/shared/components/column/create-workspace-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import { parseSorterToAntdState } from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface WorkspaceListBodyProps {
  /** 워크스페이스 목록 데이터 */
  content: AdminWorkspaceDetailItemResponse[];
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 워크스페이스 목록 페이지 본문 컴포넌트
 *
 * 워크스페이스 목록 페이지에서 워크스페이스 목록을 표시하는 테이블을 제공합니다.
 *
 * @param content - 워크스페이스 목록 데이터
 * @param loading - 로딩 상태
 */
export function WorkspaceListBody({
  content,
  loading,
}: WorkspaceListBodyProps) {
  const [checkedList, setCheckedList] = useAtom(workspaceCheckedListAtom);
  const sort = useAtomValue(workspaceSortAtom);
  const { resetForSort } = useWorkspaceListReset();

  const { rowSelection } = useTableSelection<AdminWorkspaceDetailItemResponse>(
    checkedList,
    setCheckedList,
  );

  const handleChange: TableProps<AdminWorkspaceDetailItemResponse>["onChange"] =
    (_, __, sorter) => {
      const parsed = parseSorterToAntdState<
        AdminWorkspaceDetailItemResponse,
        WorkspaceSortField
      >(sorter, WORKSPACE_SORT_FIELDS);
      if (!parsed.field || !parsed.order) return;

      resetForSort({
        field: parsed.field,
        order: parsed.order,
      });
    };

  return (
    <ListWrapper data-testid={SELECTOR.LIST_TABLE}>
      <CustomizedTable
        columns={createWorkspaceColumn(sort)}
        data={content}
        columnHeight={38}
        loading={loading}
        rowKey="workspaceId"
        rowSelection={rowSelection}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
