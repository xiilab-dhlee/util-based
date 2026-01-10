"use client";

import { useRef } from "react";
import { Icon, Modal } from "xiilab-ui";

import type { DefaultWorkspaceRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useSetDefaultWorkspaceAction } from "@/domain/workspace/hooks/workspace-actions";
import { openSetDefaultWorkspaceModalAtom } from "@/domain/workspace/state/workspace.atom";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function SetDefaultWorkspaceModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openSetDefaultWorkspaceModalAtom,
  );

  const workspaceIdRef = useRef<number | null>(null);

  const setDefaultWorkspaceMutation = useSetDefaultWorkspaceAction();
  const isPending = setDefaultWorkspaceMutation.isPending;

  const handleClose = () => {
    onClose();
    workspaceIdRef.current = null;
  };

  const handleOk = () => {
    if (!workspaceIdRef.current) return;

    const body = { isDefault: true } satisfies DefaultWorkspaceRequest;

    setDefaultWorkspaceMutation.mutate(
      { workspaceId: workspaceIdRef.current, data: body },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  useSubscribe(
    WORKSPACE_EVENTS.sendSetDefaultWorkspace,
    (workspaceId: number) => {
      workspaceIdRef.current = workspaceId;
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="SystemFilled" color="#fff" size={20} />}
      modalWidth={300}
      open={open}
      closable={!isPending}
      onCancel={handleClose}
      onOk={handleOk}
      title="Default 워크스페이스 설정"
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
      해당 워크스페이스를 Default 워크스페이스로 <br />
      설정하시겠습니까?
    </Modal>
  );
}
