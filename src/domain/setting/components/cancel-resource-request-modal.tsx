"use client";

import { useAtomValue } from "jotai";
import { useRef } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { openCancelResourceRequestModalAtom } from "@/domain/setting/state/setting.atom";
import { useCancelResourceRequestAction } from "@/domain/workspace/hooks/workspace-actions";
import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

export function CancelResourceRequestModal() {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId ?? null;

  const { open, onOpen, onClose } = useGlobalModal(
    openCancelResourceRequestModalAtom,
  );

  const resourceRequestIdRef = useRef<number | null>(null);

  const cancelResourceRequestMutation = useCancelResourceRequestAction();
  const isPending = cancelResourceRequestMutation.isPending;

  useSubscribe<number>(SETTING_EVENTS.sendCancelResourceRequest, (id) => {
    if (!id) return;
    resourceRequestIdRef.current = id;
    onOpen();
  });

  const handleClose = () => {
    if (isPending) return;
    resourceRequestIdRef.current = null;
    onClose();
  };

  const handleOk = () => {
    if (!workspaceId) {
      toast.error("워크스페이스가 선택되지 않았습니다.");
      return;
    }
    const resourceRequestId = resourceRequestIdRef.current;
    if (!resourceRequestId) {
      toast.error("취소할 리소스 요청을 선택해 주세요.");
      return;
    }

    cancelResourceRequestMutation.mutate(
      { workspaceId, resourceRequestId },
      {
        onSuccess: () => {
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
      okText="요청 취소"
      title="리소스 요청 취소"
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
      리소스 요청을 취소하시겠습니까? 요청을 취소하면 <br />
      관리자에게 해당 요청이 전달되지 않으며,
      <br />
      새로운 리소스 요청을 다시 진행하실 수 있습니다.
    </Modal>
  );
}
