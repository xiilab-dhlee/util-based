"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";

import { useGetPendingAccounts } from "@/domain/account-management/hooks/use-get-pending-accounts";
import {
  accountPendingCheckedListAtom,
  accountPendingPageAtom,
  accountPendingSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 가입 승인 목록 페이지 하단 푸터 컴포넌트
 *
 * 가입 승인 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 가입 승인 목록 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 가입 승인 목록 페이지 하단 푸터 컴포넌트
 */
export function AccountPendingListFooter() {
  // 페이지 번호
  const [page, setPage] = useAtom(accountPendingPageAtom);
  // 검색어
  const searchText = useAtomValue(accountPendingSearchTextAtom);
  // 체크박스 초기화
  const resetCheckedList = useResetAtom(accountPendingCheckedListAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetPendingAccounts({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    resetCheckedList();
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
