"use client";

import { useAtomValue } from "jotai";

import { useGetAccounts } from "@/domain/account-management/hooks/use-get-accounts";
import {
  accountPageAtom,
  accountSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { createAccountColumn } from "@/shared/components/column/create-account-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 사용자 목록 페이지 본문 컴포넌트
 *
 * 사용자 목록 페이지에서 사용자 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 사용자 목록 페이지 본문 컴포넌트
 */
export function AccountListBody() {
  // 페이지 번호
  const page = useAtomValue(accountPageAtom);
  // 검색어
  const searchText = useAtomValue(accountSearchTextAtom);

  const { data } = useGetAccounts({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createAccountColumn()}
        data={data?.content || []}
        columnHeight={38}
      />
    </ListWrapper>
  );
}
