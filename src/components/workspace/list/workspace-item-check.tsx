"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import { workspaceCheckedListAtom } from "@/atoms/workspace/workspace-list.atom";
import type { WorkspaceListType } from "@/schemas/workspace.schema";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface WorkspaceItemCheckProps {
  /** 워크스페이스 데이터 */
  workspace: WorkspaceListType;
}

/**
 * 개별 워크스페이스 선택 체크박스 컴포넌트
 *
 * 개별 워크스페이스를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 workspaceCheckedListAtom으로 관리됩니다.
 *
 * @param workspace - 워크스페이스 데이터
 * @returns 개별 선택 체크박스 컴포넌트
 */
export function WorkspaceItemCheck({ workspace }: WorkspaceItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(workspaceCheckedListAtom);

  // 현재 워크스페이스가 선택되었는지 확인
  const isChecked = checkedList.has(workspace.id);

  // 개별 선택/해제 처리
  const handleSelect = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(workspace.id);
      } else {
        next.delete(workspace.id);
      }

      return next;
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <Checkbox
        size="small"
        checked={isChecked}
        onChange={(e) => handleSelect(e.target.checked)}
      />
    </ColumnAlignCenterWrap>
  );
}

