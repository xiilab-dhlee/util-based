"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import {
  workspaceCheckedListAtom,
  workspacePageAtom,
  workspaceSearchTextAtom,
} from "@/atoms/workspace.atom";
import { ListDeleteButton } from "@/components/common/button/list-delete-button";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { WORKSPACE_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetWorkspaces } from "@/hooks/workspace/use-get-workspaces";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 워크스페이스 목록 페이지 하단 푸터 컴포넌트
 *
 * 워크스페이스 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 워크스페이스 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 워크스페이스 목록 페이지 하단 푸터 컴포넌트
 */
export function WorkspaceListFooter() {
  const publish = usePublish();
  // 페이지 번호
  const [page, setPage] = useAtom(workspacePageAtom);
  // 검색어
  const searchText = useAtomValue(workspaceSearchTextAtom);
  // 체크된 워크스페이스 목록
  const checkedList = useAtomValue(workspaceCheckedListAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetWorkspaces({
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
    // 삭제할 워크스페이스가 없으면 에러 메시지 표시
    if (checkedList.size === 0) {
      toast.error("삭제할 워크스페이스를 선택해 주세요.");
      return;
    }
    // 워크스페이스 삭제 모달에 데이터 전달
    publish(WORKSPACE_EVENTS.sendDeleteWorkspace, Array.from(checkedList));
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
