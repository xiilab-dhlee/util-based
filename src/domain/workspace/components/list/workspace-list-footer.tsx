"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import {
  workspaceCheckedListAtom,
  workspacePageAtom,
} from "@/domain/workspace/state/workspace.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface WorkspaceListFooterProps {
  /** 전체 워크스페이스 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 워크스페이스 목록 페이지 하단 푸터 컴포넌트
 *
 * 워크스페이스 목록 페이지에서 페이지 번호를 관리하고,
 * 총 워크스페이스 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @param total - 전체 워크스페이스 수
 * @param loading - 로딩 상태
 */
export function WorkspaceListFooter({
  total,
  loading,
}: WorkspaceListFooterProps) {
  const publish = usePublish();
  const [page, setPage] = useAtom(workspacePageAtom);
  const checkedList = useAtomValue(workspaceCheckedListAtom);

  /**
   * 삭제 버튼 클릭 핸들러
   */
  const handleClickDelete = () => {
    if (checkedList.size === 0) {
      toast.error("삭제할 워크스페이스를 선택해 주세요.");
      return;
    }
    publish(WORKSPACE_EVENTS.sendDeleteWorkspace, Array.from(checkedList));
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={setPage}
      isLoading={loading}
      rightChildren={<ListDeleteButton onClick={handleClickDelete} />}
    />
  );
}
