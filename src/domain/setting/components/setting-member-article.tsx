"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect, useState } from "react";
import styled from "styled-components";

import type { WorkspaceMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetWorkspaceMembers } from "@/api/generated/workspace-member/workspace-member";
import { AddWorkspaceMemberModal } from "@/domain/setting/components/add-workspace-member-modal";
import { DeleteWorkspaceMemberModal } from "@/domain/setting/components/delete-workspace-member-modal";
import { SettingMemberListBody } from "@/domain/setting/components/setting-member-list-body";
import { SettingMemberListFilter } from "@/domain/setting/components/setting-member-list-filter";
import { SettingMemberListFooter } from "@/domain/setting/components/setting-member-list-footer";
import { UpdateWorkspaceMemberRoleModal } from "@/domain/setting/components/update-workspace-member-role-modal";
import { MEMBER_LIST_PAGE_SIZE } from "@/domain/setting/constants/setting.constant";
import {
  settingMemberPageAtom,
  settingMemberSearchTextAtom,
} from "@/domain/setting/state/setting.atom";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { GROUP_TREE_NODE_TYPE } from "@/shared/schemas/group-tree.schema";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import type { SelectedMember } from "@/shared/types/member-selection.type";

export function SettingMemberArticle() {
  const publish = usePublish();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const [searchText, setSearchText] = useAtom(settingMemberSearchTextAtom);
  const [page, setPage] = useAtom(settingMemberPageAtom);
  const resetSearchText = useResetAtom(settingMemberSearchTextAtom);
  const resetPage = useResetAtom(settingMemberPageAtom);

  const workspaceId = selectedWorkspace?.workspaceId;
  const [inputValue, setInputValue] = useState(searchText);

  const { data, isLoading, isError } = useGetWorkspaceMembers(
    workspaceId ?? 0,
    {
      pageNo: page - 1,
      pageSize: MEMBER_LIST_PAGE_SIZE,
      keyword: searchText,
    },
    {
      query: {
        enabled: Boolean(workspaceId),
      },
    },
  );

  const members: WorkspaceMemberResponse[] = data?.content ?? [];

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    setPage(1);
    setSearchText(trimmed);
  };

  const handleClickAddMember = () => {
    const selectedAccounts: SelectedMember[] = members.map((member) => ({
      id: member.accountId,
      name: member.accountName,
      email: member.email,
      type: GROUP_TREE_NODE_TYPE.account,
    }));

    publish(SETTING_EVENTS.sendAddWorkspaceMember, { selectedAccounts });
  };

  const totalSize = data?.totalSize ?? 0;

  useEffect(() => {
    setInputValue(searchText);
  }, [searchText]);

  useEffect(() => {
    if (!workspaceId) return;
    resetSearchText();
    resetPage();
  }, [workspaceId, resetPage, resetSearchText]);

  return (
    <>
      <Container>
        <SettingMemberListFilter
          total={totalSize}
          searchValue={inputValue}
          onChangeSearchValue={setInputValue}
          onSearch={handleSearch}
          onClickAddMember={handleClickAddMember}
        />
        <SettingMemberListBody
          members={members}
          isLoading={isLoading}
          isError={isError}
        />
        <SettingMemberListFooter
          total={totalSize}
          page={page}
          pageSize={MEMBER_LIST_PAGE_SIZE}
          isLoading={isLoading}
          onChangePage={setPage}
        />
      </Container>
      {/* 워크스페이스 구성원 추가 모달 */}
      <AddWorkspaceMemberModal />
      {/* 워크스페이스 구성원 권한 수정 모달 */}
      <UpdateWorkspaceMemberRoleModal />
      {/* 워크스페이스 구성원 삭제 모달 */}
      <DeleteWorkspaceMemberModal />
    </>
  );
}

const Container = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
