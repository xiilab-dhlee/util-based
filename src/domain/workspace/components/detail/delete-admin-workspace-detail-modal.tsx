"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useDeleteAdminWorkspacesAction } from "@/domain/workspace/hooks/workspace-actions";
import { openDeleteAdminWorkspaceDetailModalAtom } from "@/domain/workspace/state/workspace.atom";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 관리자용 워크스페이스 상세 페이지 삭제 확인 모달 컴포넌트
 *
 * 상세 페이지에서 단일 워크스페이스를 삭제하기 전 사용자 확인을 받습니다.
 */
export function DeleteAdminWorkspaceDetailModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteAdminWorkspaceDetailModalAtom,
  );

  const router = useRouter();
  const workspaceIdRef = useRef<number | null>(null);

  const { mutate: deleteWorkspaces, isPending } =
    useDeleteAdminWorkspacesAction();

  const handleClose = useMemo(() => {
    return () => {
      if (isPending) return;
      onClose();
      workspaceIdRef.current = null;
    };
  }, [isPending, onClose]);

  const handleOk = () => {
    if (isPending) return;
    if (workspaceIdRef.current === null) return;

    deleteWorkspaces(
      { data: { workspaceId: [workspaceIdRef.current] } },
      {
        onSuccess: () => {
          handleClose();
          router.replace(ROUTES.ADMIN_WORKSPACE);
        },
      },
    );
  };

  useSubscribe(
    WORKSPACE_EVENTS.sendDeleteAdminWorkspace,
    (data: { workspaceId: number }) => {
      workspaceIdRef.current = data.workspaceId;
      onOpen();
    },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: open 변경 감지 목적
  useEffect(() => {
    if (open) return;
    workspaceIdRef.current = null;
  }, [open, onClose, handleClose]);

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
        한번 삭제한 워크스페이스는 복구할 수 없습니다.
        <br />
        선택한 워크스페이스를 삭제하시겠습니까?
      </div>
    </Modal>
  );
}
