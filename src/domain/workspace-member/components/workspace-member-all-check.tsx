"use client";

import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import { useGetWorkspaceMembers } from "@/domain/workspace/hooks/use-get-workspace-members";
import {
  workspaceMemberCheckedListAtom,
  workspaceMemberPageAtom,
  workspaceMemberSearchTextAtom,
} from "@/domain/workspace-member/state/workspace-member.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

/**
 * 워크스페이스 목록 전체 선택 체크박스 컴포넌트
 *
 * 현재 페이지의 모든 워크스페이스를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 workspaceCheckedListAtom으로 관리됩니다.
 *
 * @returns 전체 선택 체크박스 컴포넌트
 */
export function WorkspaceMemberAllCheck() {
  const [checkedList, setCheckedList] = useAtom(workspaceMemberCheckedListAtom);
  const page = useAtomValue(workspaceMemberPageAtom);
  const searchText = useAtomValue(workspaceMemberSearchTextAtom);

  // 현재 페이지의 워크스페이스 목록 조회
  const { data } = useGetWorkspaceMembers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 현재 페이지의 워크스페이스 ID 목록
  const currentPageIds = useMemo(() => {
    return data?.content?.map((workspaceMember) => workspaceMember.id) || [];
  }, [data?.content]);

  // 현재 페이지의 모든 워크스페이스가 선택되었는지 확인
  const isAllChecked = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every((id: string) => checkedList.has(id));
  }, [currentPageIds, checkedList]);

  // 현재 페이지의 일부 워크스페이스가 선택되었는지 확인 (indeterminate 상태)
  const isIndeterminate = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    const checkedCount = currentPageIds.filter((id: string) =>
      checkedList.has(id),
    ).length;
    return checkedCount > 0 && checkedCount < currentPageIds.length;
  }, [currentPageIds, checkedList]);

  // 전체 선택/해제 처리
  const handleSelectAll = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        // 현재 페이지의 모든 워크스페이스 선택
        currentPageIds.forEach((id: string) => {
          next.add(id);
        });
      } else {
        // 현재 페이지의 모든 워크스페이스 선택 해제
        currentPageIds.forEach((id: string) => {
          next.delete(id);
        });
      }

      return next;
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <Checkbox
        size="small"
        checked={isAllChecked}
        indeterminate={isIndeterminate}
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
    </ColumnAlignCenterWrap>
  );
}
