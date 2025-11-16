"use client";

import { useAtomValue } from "jotai";
import { Button } from "xiilab-ui";

import { memberAddModalOpenAtom } from "@/atoms/setting/setting-modal.atom";
import {
  workspaceMemberPageAtom,
  workspaceMemberSearchTextAtom,
} from "@/atoms/workspace/workspace-member.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSearch } from "@/hooks/common/use-search";
import { useGetWorkspaceMembers } from "@/hooks/workspace/use-get-workspace-members";
import { MySearchFilter } from "@/layouts/common/search-filter";

export function WorkspaceMemberFilter() {
  const { onSubmit } = useSearch(workspaceMemberSearchTextAtom);
  const { onOpen } = useGlobalModal(memberAddModalOpenAtom);
  const page = useAtomValue(workspaceMemberPageAtom);
  const searchText = useAtomValue(workspaceMemberSearchTextAtom);

  const { data } = useGetWorkspaceMembers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  const handleCreateMember = () => {
    onOpen();
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
