"use client";

import { useAtomValue } from "jotai";

import {
  workspaceMemberPageAtom,
  workspaceMemberSearchTextAtom,
} from "@/atoms/workspace/workspace-member.atom";
import { workspaceMemberColumn } from "@/components/common/column/workspace-member-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import workspaceMemberConstants from "@/constants/workspace/workspace-member.constant";
import { useGetWorkspaceMembers } from "@/hooks/workspace/use-get-workspace-members";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function WorkspaceMemberBody() {
  // 페이지 번호
  const page = useAtomValue(workspaceMemberPageAtom);
  // 검색어
  const searchText = useAtomValue(workspaceMemberSearchTextAtom);

  const { data } = useGetWorkspaceMembers({
    page,
    size: workspaceMemberConstants.pageSize,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={workspaceMemberColumn}
        data={data?.content || []}
      />
    </ListWrapper>
  );
}
