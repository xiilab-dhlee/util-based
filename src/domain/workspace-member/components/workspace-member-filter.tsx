"use client";

import { useAtomValue } from "jotai";
import { Button } from "xiilab-ui";

import { useGetWorkspaceMembers } from "@/domain/workspace/hooks/use-get-workspace-members";
// import { memberAddModalOpenAtom } from "@/atoms/setting/setting-modal.atom";
import {
  workspaceMemberPageAtom,
  workspaceMemberSearchTextAtom,
} from "@/domain/workspace-member/state/workspace-member.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
// import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSearch } from "@/shared/hooks/use-search";

export function WorkspaceMemberFilter() {
  const { onSubmit } = useSearch(workspaceMemberSearchTextAtom);
  // const { onOpen } = useGlobalModal(memberAddModalOpenAtom);
  const page = useAtomValue(workspaceMemberPageAtom);
  const searchText = useAtomValue(workspaceMemberSearchTextAtom);

  const { data } = useGetWorkspaceMembers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  const handleCreateMember = () => {
    // onOpen();
  };

  return (
    <MySearchFilter title="워크스페이스 멤버 목록" total={data?.totalSize}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={100}
        height={30}
        onClick={handleCreateMember}
      >
        멤버 추가
      </Button>
    </MySearchFilter>
  );
}
