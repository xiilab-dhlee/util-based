"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Button, Input } from "xiilab-ui";

import { SETTING_LIST_PAGE_SIZE } from "@/domain/setting/constants/setting.constant";
import { useGetSettingWorkspaceMembers } from "@/domain/setting/hooks/use-get-setting-workspace-members";
import { settingMemberSearchTextAtom } from "@/domain/setting/state/setting.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { AddWorkspaceMemberModal } from "./add-workspace-member-modal";

export function SettingMemberListFilter() {
  const setSearchText = useSetAtom(settingMemberSearchTextAtom);
  const publish = usePublish();
  const searchText = useAtomValue(settingMemberSearchTextAtom);

  const { data } = useGetSettingWorkspaceMembers({
    page: 1,
    size: SETTING_LIST_PAGE_SIZE,
    searchText: searchText,
  });

  /**
   * 구성원 추가 버튼 클릭 핸들러
   * PubSub을 통해 워크스페이스 구성원 추가 모달에 데이터를 전달합니다.
   */
  const handleAddMember = () => {
    // TODO: 현재 구성원 목록을 selectedAccounts로 전달 필요
    publish(SETTING_EVENTS.sendAddWorkspaceMember, {
      selectedAccounts: [],
    });
  };

  return (
    <>
      <MySearchFilter title="구성원 관리" total={data?.totalSize}>
        <Input.Search
          name="search"
          placeholder="검색어를 입력하세요."
          onSearch={(value) => setSearchText(value.trim())}
          autoComplete="off"
          width={220}
          height={30}
        />
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

      {/* 워크스페이스 구성원 추가 모달 */}
      <AddWorkspaceMemberModal />
    </>
  );
}
