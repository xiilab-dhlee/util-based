"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import { accountCheckedListAtom } from "@/domain/account-management/state/account.atom";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface AccountItemCheckProps {
  /** 사용자 데이터 */
  account: AccountListType;
}

/**
 * 개별 사용자 선택 체크박스 컴포넌트
 *
 * 개별 사용자를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 accountCheckedListAtom으로 관리됩니다.
 *
 * @param account - 사용자 데이터
 * @returns 개별 선택 체크박스 컴포넌트
 */
export function AccountItemCheck({ account }: AccountItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(accountCheckedListAtom);

  // 현재 사용자가 선택되었는지 확인
  const isChecked = checkedList.has(account.id);

  // 개별 선택/해제 처리
  const handleSelect = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(account.id);
      } else {
        next.delete(account.id);
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
