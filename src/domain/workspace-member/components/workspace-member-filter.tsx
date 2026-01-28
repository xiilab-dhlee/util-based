"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button, Input } from "xiilab-ui";

import { AddWorkspaceMemberModal } from "@/domain/setting/components/add-workspace-member-modal";
// TODO: Orval API 연동 필요
// import { useAtomValue } from "jotai";
// import { useGetWorkspaceMembers } from "@/domain/workspace/hooks/use-get-workspace-members";
import {
  workspaceMemberPageAtom,
  workspaceMemberSearchTextAtom,
} from "@/domain/workspace-member/state/workspace-member.atom";
import { ITEM_TYPES } from "@/shared/components/group-member-selector/types";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
// import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import type { SelectedMember } from "@/shared/types/member-selection.type";

export function WorkspaceMemberFilter() {
  const setSearchText = useSetAtom(workspaceMemberSearchTextAtom);
  const resetPage = useResetAtom(workspaceMemberPageAtom);
  const publish = usePublish();
  // TODO: Orval API 연동 필요
  // const page = useAtomValue(workspaceMemberPageAtom);
  // const searchText = useAtomValue(workspaceMemberSearchTextAtom);

  // TODO: Orval API 연동 필요
  // const { data, isLoading, isError } = useGetWorkspaceMembers({
  //   page,
  //   size: LIST_PAGE_SIZE,
  //   searchText,
  // });
  const data = {
    content: [] as { id: string; name: string; email: string }[],
    totalSize: 0,
  };
  const isLoading = false;
  const isError = false;

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  /**
   * 구성원 추가 버튼 클릭 핸들러
   * PubSub을 통해 워크스페이스 구성원 추가 모달에 데이터를 전달합니다.
   */
  const handleCreateMember = () => {
    if (!data || isLoading || isError) {
      publish(SETTING_EVENTS.sendAddWorkspaceMember, {
        selectedAccounts: [],
      });
      return;
    }

    const mappedAccounts: SelectedMember[] = (data.content ?? []).map(
      (member) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        type: ITEM_TYPES.ACCOUNT,
      }),
    );

    publish(SETTING_EVENTS.sendAddWorkspaceMember, {
      selectedAccounts: mappedAccounts,
    });
  };

  return (
    <>
      <MySearchFilter title="워크스페이스 멤버 목록" total={data?.totalSize}>
        <Input.Search
          name="search"
          placeholder="검색어를 입력하세요."
          onSearch={handleSearch}
          autoComplete="off"
          width={220}
          height={30}
        />
        <Button
          color="primary"
          icon="Plus"
          iconPosition="left"
          variant="gradient"
          width={100}
          height={30}
          onClick={handleCreateMember}
        >
          구성원 추가
        </Button>
      </MySearchFilter>
      <AddWorkspaceMemberModal />
    </>
  );
}
