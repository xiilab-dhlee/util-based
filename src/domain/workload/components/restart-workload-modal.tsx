"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useRestartWorkload } from "@/domain/workload/hooks/use-restart-workload";
import type { WorkloadIdType } from "@/domain/workload/schemas/workload.schema";
import { openRestartWorkloadModalAtom } from "@/domain/workload/state/workload.atom";
import { RefreshIcon } from "@/shared/components/icon/refresh-icon";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 워크로드 재시작 모달 컴포넌트
 *
 * 선택한 워크로드를 재시작할 수 있는 모달입니다.
 * 재시작 완료 시 pubsub 이벤트를 발행하여 다른 컴포넌트에서 처리할 수 있습니다.
 */
export function RestartWorkloadModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openRestartWorkloadModalAtom,
  );

  // 재시작할 워크로드 ID
  const [restartWorkloadId, setRestartWorkloadId] =
    useState<WorkloadIdType | null>(null);

  const restartWorkload = useRestartWorkload();

  /**
   * 폼 제출 처리 함수
   *
   * 워크로드 재시작을 실행하고 모달을 닫습니다.
   * 재시작 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    if (!restartWorkloadId) {
      toast.error("재시작할 워크로드를 선택해 주세요.");
      return;
    }

    // 워크로드 재시작 실행
    restartWorkload.mutate(restartWorkloadId, {
      onSuccess: () => {
        toast.success("워크로드 재시작 완료");
        // 모달 닫기
        onClose();
      },
    });
  };

  /**
   * 워크로드 재시작 모달 데이터 구독
   */
  useSubscribe(
    WORKLOAD_EVENTS.sendRestartWorkload,
    (workloadId: WorkloadIdType) => {
      // 재시작할 워크로드 ID 설정
      setRestartWorkloadId(workloadId);
      // 재시작 모달 열기
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<RefreshIcon width={20} height={20} fill="#fff" />}
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="워크로드 재시작"
      centered
      okButtonProps={{
        loading: restartWorkload.isPending,
      }}
    >
      <div>해당 워크로드를 재시작하시겠습니까?</div>
    </Modal>
  );
}
