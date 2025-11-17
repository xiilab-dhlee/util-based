"use client";

import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import {
  userCheckedListAtom,
  userPageAtom,
  userSearchTextAtom,
} from "@/atoms/user/user-list.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetUsers } from "@/hooks/user/use-get-users";
import type { UserListType } from "@/schemas/user.schema";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

/**
 * 사용자 목록 전체 선택 체크박스 컴포넌트
 *
 * 현재 페이지의 모든 사용자를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 userCheckedListAtom으로 관리됩니다.
 *
 * @returns 전체 선택 체크박스 컴포넌트
 */
export function UserAllCheck() {
  const [checkedList, setCheckedList] = useAtom(userCheckedListAtom);
  const page = useAtomValue(userPageAtom);
  const searchText = useAtomValue(userSearchTextAtom);

  // 현재 페이지의 사용자 목록 조회
  const { data } = useGetUsers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 현재 페이지의 사용자 ID 목록
  const currentPageIds = useMemo(() => {
    return data?.content?.map((user: UserListType) => user.id) || [];
  }, [data?.content]);

  // 현재 페이지의 모든 사용자가 선택되었는지 확인
  const isAllChecked = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every((id: string) => checkedList.has(id));
  }, [currentPageIds, checkedList]);

  // 현재 페이지의 일부 사용자가 선택되었는지 확인 (indeterminate 상태)
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
        // 현재 페이지의 모든 사용자 선택
        currentPageIds.forEach((id: string) => {
          next.add(id);
        });
      } else {
        // 현재 페이지의 모든 사용자 선택 해제
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
