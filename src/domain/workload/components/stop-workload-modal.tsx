"use client";

import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useTerminateWorkload } from "@/api/generated/workload/workload";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/** 이벤트 페이로드 타입 */
interface StopWorkloadPayload {
  workloadResourceName: string;
  workspaceId: number;
}

/**
 * 워크로드 종료 모달 컴포넌트
 *
 * 선택한 워크로드를 종료할 수 있는 모달입니다.
 */
export function StopWorkloadModal() {
  // 모달 열림 상태
  const [open, setOpen] = useState(false);

  // 종료할 워크로드 정보
  const [workloadResourceName, setWorkloadResourceName] = useState<
    string | null
  >(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

  const { mutate, isPending } = useTerminateWorkload();

  /**
   * 모달 닫기
   */
  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  /**
   * 워크로드 종료 처리 함수
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
        },
      },
    );
  };

  /**
   * 워크로드 종료 모달 데이터 구독
   */
  useSubscribe<StopWorkloadPayload>(
    WORKLOAD_EVENTS.openStopModal,
    (payload) => {
      setWorkloadResourceName(payload.workloadResourceName);
      setWorkspaceId(payload.workspaceId);
      setOpen(true);
    },
  );

  return (
    <Modal
      type="danger"
      icon={<Icon name="PowerBold" color="#fff" size={18} />}
      modalWidth={300}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      title="워크로드 종료"
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
      <div>해당 워크로드를 종료하시겠습니까?</div>
    </Modal>
  );
}
