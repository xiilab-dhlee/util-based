"use client";

import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";
import type { ChangeEvent } from "react";
import { Button, Input } from "xiilab-ui";

import { useGetWorkspaceMemberRole } from "@/api/generated/workspace-member/workspace-member";
import { isWorkspaceOwnerRole } from "@/domain/workspace/constants/workspace.constant";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { getSessionAccountId } from "@/shared/utils/auth.util";

interface SettingMemberListFilterProps {
  total?: number;
  searchValue: string;
  onChangeSearchValue: (next: string) => void;
  onSearch: (value: string) => void;
  onClickAddMember: () => void;
}

export function SettingMemberListFilter({
  total,
  searchValue,
  onChangeSearchValue,
  onSearch,
  onClickAddMember,
}: SettingMemberListFilterProps) {
  const { data: session } = useSession();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;
  const accountId = getSessionAccountId(session);

  const { data: memberRole } = useGetWorkspaceMemberRole(
    workspaceId ?? -1,
    accountId ?? "",
    {
      query: {
        enabled: Boolean(workspaceId) && Boolean(accountId),
      },
    },
  );

  const canAddMember = isWorkspaceOwnerRole(memberRole?.memberRole);
  const handleSearch = (value: string) => {
    onSearch(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeSearchValue(e.target.value);
  };

  const handleAddMemberClick = () => {
    if (!canAddMember) return;
    onClickAddMember();
  };

  return (
    <MySearchFilter title="구성원 관리" total={total}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        value={searchValue}
        onChange={handleChange}
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
      />
      {canAddMember && (
        <Button
          color="primary"
          icon="Plus"
          iconPosition="left"
          variant="gradient"
          width={110}
          height={30}
          onClick={handleAddMemberClick}
        >
          구성원 추가
        </Button>
      )}
    </MySearchFilter>
  );
}
