"use client";

import { useAtomValue } from "jotai";

import { createWorkspaceMemberColumn } from "@/shared/components/column/create-workspace-member-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { SETTING_LIST_PAGE_SIZE } from "../constants/setting.constant";
import { useGetSettingWorkspaceMembers } from "../hooks/use-get-setting-workspace-members";
import {
  settingMemberPageAtom,
  settingMemberSearchTextAtom,
} from "../state/setting.atom";

export function SettingMemberListBody() {
  // 페이지 번호
  const page = useAtomValue(settingMemberPageAtom);
  // 검색어
  const searchText = useAtomValue(settingMemberSearchTextAtom);

  const { data } = useGetSettingWorkspaceMembers({
    page,
    size: SETTING_LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createWorkspaceMemberColumn([
          {
            key: "name",
            dataIndex: "name",
            title: "이름",
            width: 50,
            ellipsis: true,
          },
          {
            dataIndex: "email",
            title: "이메일",
            width: 120,
            ellipsis: true,
          },
          {
            dataIndex: "group",
            title: "그룹",
            width: 90,
            ellipsis: true,
          },
          {
            dataIndex: "role",
            title: "권한",
            width: 100,
          },
          {
            dataIndex: "update",
            title: "권한 수정",
            width: 60,
          },
          {
            dataIndex: "delete",
            title: "삭제",
          },
        ])}
        data={data?.content || []}
        activePadding
      />
    </ListWrapper>
  );
}
