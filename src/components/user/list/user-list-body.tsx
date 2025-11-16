"use client";

import { useAtomValue } from "jotai";

import { userPageAtom, userSearchTextAtom } from "@/atoms/user/user-list.atom";
import { createUserColumn } from "@/components/common/column/create-user-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import userListConstants from "@/constants/user/user-list.constant";
import { useGetUsers } from "@/hooks/user/use-get-users";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 사용자 목록 페이지 본문 컴포넌트
 *
 * 사용자 목록 페이지에서 사용자 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 사용자 목록 페이지 본문 컴포넌트
 */
export function UserListBody() {
  // 페이지 번호
  const page = useAtomValue(userPageAtom);
  // 검색어
  const searchText = useAtomValue(userSearchTextAtom);

  const { data } = useGetUsers({
    page,
    size: userListConstants.pageSize,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createUserColumn()}
        data={data?.content || []}
      />
    </ListWrapper>
  );
}
