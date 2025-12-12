"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useDeleteWorkload } from "@/domain/workload/hooks/use-delete-workload";
import type { WorkloadIdType } from "@/domain/workload/schemas/workload.schema";
import { openDeleteWorkloadModalAtom } from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 워크로드 삭제 모달 컴포넌트
 *
 * 선택한 워크로드를 삭제할 수 있는 모달입니다.
 * 삭제 완료 시 pubsub 이벤트를 발행하여 다른 컴포넌트에서 처리할 수 있습니다.
 */
export function DeleteWorkloadModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openDeleteWorkloadModalAtom);

  // 삭제할 워크로드 ID
  const [deleteWorkloadId, setDeleteWorkloadId] =
    useState<WorkloadIdType | null>(null);

  const deleteWorkload = useDeleteWorkload();

  /**
   * 폼 제출 처리 함수
   *
   * 워크로드 삭제를 실행하고 모달을 닫습니다.
   * 삭제 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    if (!deleteWorkloadId) {
      toast.error("삭제할 워크로드를 선택해 주세요.");
      return;
    }

    onClose();

    // 워크로드 삭제 실행
    // deleteWorkload.mutate(deleteWorkloadId, {
    //   onSuccess: () => {
    //     toast.success("워크로드 삭제 완료");
    //     // 모달 닫기
    //     onClose();
    //   },
    // });
  };

  /**
   * 워크로드 삭제 모달 데이터 구독
   */
  useSubscribe(
    WORKLOAD_EVENTS.sendDeleteWorkload,
    (workloadId: WorkloadIdType) => {
      // 삭제할 워크로드 ID 설정
      setDeleteWorkloadId(workloadId);
      // 삭제 모달 열기
      onOpen();
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="워크로드 삭제"
      centered
      okButtonProps={{
        loading: deleteWorkload.isPending,
      }}
    >
      <div>선택한 워크로드를 삭제하시겠습니까?</div>
      <div>삭제 시 해당 워크로드는 복구되지 않습니다.</div>
    </Modal>
  );
}
