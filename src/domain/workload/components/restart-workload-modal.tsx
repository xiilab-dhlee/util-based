"use client";

import { useState } from "react";
import { Modal } from "xiilab-ui";

import { useRestartWorkload } from "@/api/generated/workload/workload";
import { RefreshIcon } from "@/shared/components/icon/refresh-icon";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/** 이벤트 페이로드 타입 */
interface RestartWorkloadPayload {
  workloadResourceName: string;
  workspaceId: number;
  resourcePresetId?: number;
}

/**
 * 워크로드 재시작 모달 컴포넌트
 *
 * 선택한 워크로드를 재시작할 수 있는 모달입니다.
 */
export function RestartWorkloadModal() {
  // 모달 열림 상태
  const [open, setOpen] = useState(false);

  // 재시작할 워크로드 정보
  const [workloadResourceName, setWorkloadResourceName] = useState<
    string | null
  >(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [resourcePresetId, setResourcePresetId] = useState<number | null>(null);

  const { mutate, isPending } = useRestartWorkload();

  /**
   * 모달 닫기
   */
  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
  };

  /**
   * 워크로드 재시작 처리 함수
   */
  const handleOk = () => {
    if (isPending) return;
    if (
      workloadResourceName === null ||
      workspaceId === null ||
      resourcePresetId === null
    )
      return;

    mutate(
      {
        workspaceId,
        workloadResourceName,
        data: {
          resourcePresetId,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  /**
   * 워크로드 재시작 모달 데이터 구독
   */
  useSubscribe<RestartWorkloadPayload>(
    WORKLOAD_EVENTS.openRestartModal,
    (payload) => {
      setWorkloadResourceName(payload.workloadResourceName);
      setWorkspaceId(payload.workspaceId);
      setResourcePresetId(payload.resourcePresetId ?? null);
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      icon={<RefreshIcon width={20} height={20} fill="#fff" />}
      modalWidth={300}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      title="워크로드 재시작"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        disabled:
          workloadResourceName === null ||
          workspaceId === null ||
          resourcePresetId === null,
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <div>해당 워크로드를 재시작하시겠습니까?</div>
    </Modal>
  );
}
