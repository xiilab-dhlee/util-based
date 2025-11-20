"use client";

import { useAtomValue } from "jotai";

import { useGetWorkspaceMembers } from "@/domain/workspace/hooks/use-get-workspace-members";
import {
  workspaceMemberPageAtom,
  workspaceMemberSearchTextAtom,
} from "@/domain/workspace-member/state/workspace-member.atom";
import { workspaceMemberColumn } from "@/shared/components/column/workspace-member-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function WorkspaceMemberBody() {
  // 페이지 번호
  const page = useAtomValue(workspaceMemberPageAtom);
  // 검색어
  const searchText = useAtomValue(workspaceMemberSearchTextAtom);

  const { data } = useGetWorkspaceMembers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={workspaceMemberColumn}
        data={data?.content || []}
        columnHeight={38}
      />
    </ListWrapper>
  );
}
