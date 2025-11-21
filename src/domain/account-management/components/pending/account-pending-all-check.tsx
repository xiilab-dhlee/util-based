"use client";

import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import { useGetPendingAccounts } from "@/domain/account-management/hooks/use-get-pending-accounts";
import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import {
  accountPendingCheckedListAtom,
  accountPendingPageAtom,
  accountPendingSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

/**
 * 가입 승인 목록 전체 선택 체크박스 컴포넌트
 *
 */
export function AccountPendingAllCheck() {
  const [checkedList, setCheckedList] = useAtom(accountPendingCheckedListAtom);
  const page = useAtomValue(accountPendingPageAtom);
  const searchText = useAtomValue(accountPendingSearchTextAtom);

  // 현재 페이지의 사용자 목록 조회
  const { data } = useGetPendingAccounts({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 현재 페이지의 사용자 ID 목록
  const currentPageIds = useMemo(() => {
    return data?.content?.map((account: AccountListType) => account.id) || [];
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
