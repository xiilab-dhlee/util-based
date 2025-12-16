"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Icon, Modal } from "xiilab-ui";

import { useStopWorkload } from "@/domain/workload/hooks/use-stop-workload";
import type { WorkloadIdType } from "@/domain/workload/schemas/workload.schema";
import { openStopWorkloadModalAtom } from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 워크로드 종료 모달 컴포넌트
 *
 * 선택한 워크로드를 종료할 수 있는 모달입니다.
 * 종료 완료 시 pubsub 이벤트를 발행하여 다른 컴포넌트에서 처리할 수 있습니다.
 */
export function StopWorkloadModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openStopWorkloadModalAtom);

  // 종료할 워크로드 ID
  const [stopWorkloadId, setStopWorkloadId] = useState<WorkloadIdType | null>(
    null,
  );

  const stopWorkload = useStopWorkload();

  /**
   * 폼 제출 처리 함수
   *
   * 워크로드 종료를 실행하고 모달을 닫습니다.
   * 종료 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    if (!stopWorkloadId) {
      toast.error("종료할 워크로드를 선택해 주세요.");
      return;
    }

    onClose();

    // 워크로드 종료 실행
    // stopWorkload.mutate(stopWorkloadId, {
    //   onSuccess: () => {
    //     toast.success("워크로드 종료 완료");
    //     // 모달 닫기
    //     onClose();
    //   },
    // });
  };

  /**
   * 워크로드 종료 모달 데이터 구독
   */
  useSubscribe(
    WORKLOAD_EVENTS.sendStopWorkload,
    (workloadId: WorkloadIdType) => {
      // 종료할 워크로드 ID 설정
      setStopWorkloadId(workloadId);
      // 종료 모달 열기
      onOpen();
    },
  );

  return (
    <Modal
      type="danger"
      icon={<Icon name="PowerBold" color="#fff" size={18} />}
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="워크로드 종료"
      centered
      okButtonProps={{
        loading: stopWorkload.isPending,
      }}
    >
      <div>해당 워크로드를 종료하시겠습니까?</div>
    </Modal>
  );
}
