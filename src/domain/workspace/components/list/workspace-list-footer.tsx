"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { toast } from "react-toastify";

import { useWorkspaceListReset } from "@/domain/workspace/hooks/use-workspace-list-reset";
import {
  openDeleteAdminWorkspacesModalAtom,
  workspaceCheckedListAtom,
  workspacePageAtom,
} from "@/domain/workspace/state/workspace.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface WorkspaceListFooterProps {
  total: number;
  loading: boolean;
}

export function WorkspaceListFooter({
  total,
  loading,
}: WorkspaceListFooterProps) {
  const [page, setPage] = useAtom(workspacePageAtom);
  const checkedList = useAtomValue(workspaceCheckedListAtom);
  const { resetForPageChange } = useWorkspaceListReset();
  const openDeleteModal = useSetAtom(openDeleteAdminWorkspacesModalAtom);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    resetForPageChange();
  };

  const handleClickDelete = () => {
    if (checkedList.size === 0) {
      toast.error("삭제할 워크스페이스를 선택해 주세요.");
      return;
    }

    openDeleteModal(true);
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={loading}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={checkedList.size === 0}
        />
      }
    />
  );
}
