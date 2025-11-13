"use client";

import { useAtomValue } from "jotai";

import {
  userPendingPageAtom,
  userPendingSearchTextAtom,
} from "@/atoms/user/user-pending-list.atom";
import { userPendingListColumn } from "@/components/common/columns/user-pending-list-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import userListConstants from "@/constants/user/user-list.constant";
import { useGetPendingUsers } from "@/hooks/user/use-get-pending-users";
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
    size: userListConstants.pageSize,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={userPendingListColumn}
        data={data?.content || []}
        activePadding
      />
    </ListWrapper>
  );
}

