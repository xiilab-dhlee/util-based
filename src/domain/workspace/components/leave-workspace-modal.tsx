"use client";

import { useRef } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useLeaveWorkspaceAction } from "@/domain/workspace/hooks/workspace-actions";
import { openLeaveWorkspaceModalAtom } from "@/domain/workspace/state/workspace.atom";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function LeaveWorkspaceModal() {
  const { open, onOpen, onClose } = useGlobalModal(openLeaveWorkspaceModalAtom);

  const workspaceIdRef = useRef<number | null>(null);

  const leaveWorkspaceMutation = useLeaveWorkspaceAction();
  const isPending = leaveWorkspaceMutation.isPending;

  const handleClose = () => {
    if (isPending) return;
    onClose();
    workspaceIdRef.current = null;
  };

  const handleOk = () => {
    if (workspaceIdRef.current === null) return;

    leaveWorkspaceMutation.mutate(
      { workspaceId: workspaceIdRef.current },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  useSubscribe(WORKSPACE_EVENTS.sendLeaveWorkspace, (workspaceId: number) => {
    workspaceIdRef.current = workspaceId;
    onOpen();
  });

  return (
    <Modal
      variant="delete"
      icon={<Icon name="Error" color="#fff" size={20} />}
      modalWidth={300}
      open={open}
      closable={!isPending}
      onCancel={handleClose}
      onOk={handleOk}
      title="워크스페이스 나가기"
      okText="확인"
      centered
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        disabled: isPending,
        loading: isPending,
      }}
    >
      워크스페이스를 나갈 경우 해당 워크스페이스를
      <br />
      이용할 수 없습니다. 나가시겠습니까?
    </Modal>
  );
}
