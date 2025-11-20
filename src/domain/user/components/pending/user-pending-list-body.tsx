"use client";

import { useAtomValue } from "jotai";

import { useGetPendingUsers } from "@/domain/user/hooks/use-get-pending-users";
import {
  userPendingPageAtom,
  userPendingSearchTextAtom,
} from "@/domain/user/state/user.atom";
import { userPendingListColumn } from "@/shared/components/column/user-pending-list-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 가입 승인 목록 페이지 본문 컴포넌트
 *
 * 가입 승인 목록 페이지에서 가입 승인 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 가입 승인 목록 페이지 본문 컴포넌트
 */
export function UserPendingListBody() {
  // 페이지 번호
  const page = useAtomValue(userPendingPageAtom);
  // 검색어
  const searchText = useAtomValue(userPendingSearchTextAtom);

  const { data } = useGetPendingUsers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={userPendingListColumn}
        data={data?.content || []}
        activePadding
        columnHeight={38}
      />
    </ListWrapper>
  );
}
