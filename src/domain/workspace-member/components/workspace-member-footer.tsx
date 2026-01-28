"use client";

import { useAtom, useAtomValue } from "jotai";

// TODO: Orval API 연동 필요 - useGetWorkspaceMembers 사용
// import { useGetWorkspaceMembers } from "@/domain/workspace/hooks/use-get-workspace-members";
import {
  workspaceMemberCheckedListAtom,
  workspaceMemberPageAtom,
  // TODO: Orval API 연동 후 사용
  // workspaceMemberSearchTextAtom,
} from "@/domain/workspace-member/state/workspace-member.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

export function WorkspaceMemberFooter() {
  const publish = usePublish();
  // 페이지 번호
  const [page, setPage] = useAtom(workspaceMemberPageAtom);
  // TODO: Orval API 연동 후 사용
  // const searchText = useAtomValue(workspaceMemberSearchTextAtom);
  // 체크된 워크스페이스 멤버 목록
  const selectedWorkspaceMembers = useAtomValue(workspaceMemberCheckedListAtom);

  // TODO: Orval API 연동 필요
  // const { data, isLoading } = useGetWorkspaceMembers({
  //   page,
  //   size: LIST_PAGE_SIZE,
  //   searchText,
  // });
  const data = { totalSize: 0 };
  const isLoading = false;

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  /**
   * 삭제 버튼 클릭 핸들러
   */
  const handleClickDelete = () => {
    publish(
      WORKSPACE_EVENTS.sendDeleteWorkspaceMember,
      Array.from(selectedWorkspaceMembers),
    );
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={selectedWorkspaceMembers.size === 0}
        />
      }
    />
  );
}
