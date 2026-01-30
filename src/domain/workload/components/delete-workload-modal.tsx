"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import { useDeleteWorkloadAction } from "@/domain/workload/hooks/workload-actions";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { isUserMode } from "@/shared/utils/router.util";

/** 이벤트 페이로드 타입 */
interface DeleteWorkloadPayload {
  workloadResourceName: string;
  workspaceId: number;
}

/**
 * 워크로드 삭제 모달 컴포넌트
 *
 * 선택한 워크로드를 삭제할 수 있는 모달입니다.
 * 삭제 완료 시 사용자 모드에 따라 적절한 페이지로 리다이렉트합니다.
 * - 사용자 모드: 워크로드 목록 페이지
 * - 관리자 모드: 워크스페이스 상세 페이지
 */
export function DeleteWorkloadModal() {
  const router = useRouter();
  const pathname = usePathname();

  // 모달 열림 상태
  const [open, setOpen] = useState(false);

  // 삭제할 워크로드 정보
  const [workloadResourceName, setWorkloadResourceName] = useState<
    string | null
  >(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

  const { mutate, isPending } = useDeleteWorkloadAction();

  const isUser = isUserMode(pathname);

  /**
   * 모달 닫기
   */
  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  /**
   * 워크로드 삭제 처리 함수
   */
  const handleOk = () => {
    if (isPending) return;
    if (workloadResourceName === null || workspaceId === null) return;

    mutate(
      {
        workspaceId,
        workloadResourceName,
      },
      {
        onSuccess: () => {
          setOpen(false);
          if (isUser) {
            router.replace(ROUTES.USER_WORKLOAD);
          } else {
            router.replace(ROUTES.ADMIN_WORKSPACE_DETAIL(String(workspaceId)));
          }
        },
      },
    );
  };

  /**
   * 워크로드 삭제 모달 데이터 구독
   */
  useSubscribe<DeleteWorkloadPayload>(
    WORKLOAD_EVENTS.openDeleteModal,
    (payload) => {
      setWorkloadResourceName(payload.workloadResourceName);
      setWorkspaceId(payload.workspaceId);
      setOpen(true);
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      title="워크로드 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        disabled: workloadResourceName === null || workspaceId === null,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <div>선택한 워크로드를 삭제하시겠습니까?</div>
      <div>삭제 시 해당 워크로드는 복구되지 않습니다.</div>
    </Modal>
  );
}
