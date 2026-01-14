"use client";

import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useDeleteWorkspacesAction } from "@/domain/workspace/hooks/workspace-actions";
import {
  openDeleteAdminWorkspacesModalAtom,
  workspaceCheckedListAtom,
} from "@/domain/workspace/state/workspace.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

/**
 * 관리자용 워크스페이스 일괄 삭제 확인 모달 컴포넌트
 *
 * 선택한 워크스페이스들을 삭제하기 전 사용자 확인을 받습니다.
 */
export function DeleteAdminWorkspacesModal() {
  const { open, onClose } = useGlobalModal(openDeleteAdminWorkspacesModalAtom);
  const checkedList = useAtomValue(workspaceCheckedListAtom);

  const { mutate: deleteWorkspaces, isPending } = useDeleteWorkspacesAction();

  const workspaceIds = useMemo(
    () => Array.from(checkedList).map((id) => Number(id)),
    [checkedList],
  );

  const count = workspaceIds.length;

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleOk = () => {
    if (isPending) return;
    if (workspaceIds.length === 0) return;

    deleteWorkspaces(
      { data: { workspaceId: workspaceIds } },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  return (
    <Modal
      type="danger"
      variant="custom"
      icon={<Icon name="Delete" color="#fff" size={20} />}
      modalWidth={310}
      open={open}
      closable={!isPending}
      onCancel={handleClose}
      onOk={handleOk}
      title="워크스페이스 삭제"
      centered
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        disabled: isPending,
        loading: isPending,
      }}
    >
      <div>
        한번 삭제한 워크스페이스는 복구 할 수 없습니다.
        <br />
        선택한 {count}개의 워크스페이스를 삭제하시겠습니까?
      </div>
    </Modal>
  );
}
