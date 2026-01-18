"use client";

import { useAtomValue } from "jotai";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useMemberListReset } from "@/domain/setting/hooks/use-member-list-reset";
import { openDeleteWorkspaceMemberModalAtom } from "@/domain/setting/state/setting.atom";
import { useDeleteWorkspaceMembersAction } from "@/domain/workspace/hooks/workspace-actions";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

export function DeleteWorkspaceMemberModal() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId ?? null;

  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteWorkspaceMemberModalAtom,
  );

  const { resetForPageChange } = useMemberListReset();

  const selectedAccountIdsRef = useRef<string[]>([]);

  const deleteWorkspaceMembersMutation = useDeleteWorkspaceMembersAction();
  const isPending = deleteWorkspaceMembersMutation.isPending;

  useSubscribe<string[]>(SETTING_EVENTS.sendDeleteWorkspaceMember, (ids) => {
    if (!ids || ids.length === 0) return;
    selectedAccountIdsRef.current = ids;
    onOpen();
  });

  const handleClose = () => {
    if (isPending) return;
    selectedAccountIdsRef.current = [];
    onClose();
  };

  const handleOk = () => {
    if (!workspaceId) {
      toast.error("워크스페이스가 선택되지 않았습니다.");
      return;
    }
    const selectedAccountIds = selectedAccountIdsRef.current;
    if (selectedAccountIds.length === 0) {
      toast.error("삭제할 구성원을 선택해 주세요.");
      return;
    }

    deleteWorkspaceMembersMutation.mutate(
      { workspaceId, data: { accountId: selectedAccountIds } },
      {
        onSuccess: () => {
          // 삭제 성공 시 페이지만 초기화 (검색어는 유지)
          resetForPageChange();
          handleClose();
        },
      },
    );
  };

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      title="구성원 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        disabled: isPending,
        loading: isPending,
      }}
    >
      <div>선택된 멤버를 워크스페이스에서 삭제하시겠습니까?</div>
      <div>삭제된 멤버는 워크스페이스의 정보를 볼 수 없습니다.</div>
    </Modal>
  );
}
