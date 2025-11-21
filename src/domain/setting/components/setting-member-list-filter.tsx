"use client";

import { useAtomValue } from "jotai";
import { Button } from "xiilab-ui";

import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useSearch } from "@/shared/hooks/use-search";
import { SETTING_LIST_PAGE_SIZE } from "../constants/setting.constant";
import { useGetSettingWorkspaceMembers } from "../hooks/use-get-setting-workspace-members";
import { settingMemberSearchTextAtom } from "../state/setting.atom";

export function SettingMemberListFilter() {
  const { onSubmit } = useSearch(settingMemberSearchTextAtom);

  const searchText = useAtomValue(settingMemberSearchTextAtom);

  const { data } = useGetSettingWorkspaceMembers({
    page: 1,
    size: SETTING_LIST_PAGE_SIZE,
    searchText: searchText,
  });

  const handleAddMember = () => {
    alert("준비 중입니다.");
  };

  return (
    <MySearchFilter title="구성원 관리" total={data?.totalSize || 0}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={110}
        height={30}
        onClick={handleAddMember}
      >
        구성원 추가
      </Button>
    </MySearchFilter>
  );
}
