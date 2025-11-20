"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import { useGetWorkspaceMembers } from "@/domain/workspace/hooks/use-get-workspace-members";
import {
  workspaceMemberCheckedListAtom,
  workspaceMemberPageAtom,
  workspaceMemberSearchTextAtom,
} from "@/domain/workspace-member/state/workspace-member.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { ListPageFooter } from "@/shared/layouts/list/list-page-footer";

export function WorkspaceMemberFooter() {
  const publish = usePublish();
  // 페이지 번호
  const [page, setPage] = useAtom(workspaceMemberPageAtom);
  // 검색어
  const searchText = useAtomValue(workspaceMemberSearchTextAtom);
  // 체크된 워크스페이스 멤버 목록
  const selectedWorkspaceMembers = useAtomValue(workspaceMemberCheckedListAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetWorkspaceMembers({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  /**
   * 삭제 버튼 클릭 핸들러
   */
  const handleClickDelete = () => {
    if (selectedWorkspaceMembers.size === 0) {
      toast.error("삭제할 워크스페이스 멤버를 선택해 주세요.");
      return;
    }

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
      rightChildren={<ListDeleteButton onClick={handleClickDelete} />}
    />
  );
}
