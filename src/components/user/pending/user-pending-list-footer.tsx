"use client";

import { useAtom, useAtomValue } from "jotai";

import {
  userPendingPageAtom,
  userPendingSearchTextAtom,
} from "@/atoms/user.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetPendingUsers } from "@/hooks/user/use-get-pending-users";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 가입 승인 목록 페이지 하단 푸터 컴포넌트
 *
 * 가입 승인 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 가입 승인 목록 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 가입 승인 목록 페이지 하단 푸터 컴포넌트
 */
export function UserPendingListFooter() {
  // 페이지 번호
  const [page, setPage] = useAtom(userPendingPageAtom);
  // 검색어
  const searchText = useAtomValue(userPendingSearchTextAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetPendingUsers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
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
