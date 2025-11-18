"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import { userPendingCheckedListAtom } from "@/atoms/user/user-pending-list.atom";
import type { UserListType } from "@/schemas/user.schema";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface UserPendingItemCheckProps {
  /** 사용자 데이터 */
  user: UserListType;
}

/**
 * 개별 사용자 선택 체크박스 컴포넌트
 *
 * 개별 사용자를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 userPendingCheckedListAtom으로 관리됩니다.
 *
 * @param user - 사용자 데이터
 * @returns 개별 선택 체크박스 컴포넌트
 */
export function UserPendingItemCheck({ user }: UserPendingItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(userPendingCheckedListAtom);

  // 현재 사용자가 선택되었는지 확인
  const isChecked = checkedList.has(user.id);

  // 개별 선택/해제 처리
  const handleSelect = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(user.id);
      } else {
        next.delete(user.id);
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
