"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

// TODO: Orval API 연동 필요
// import { useDeleteRequestResource } from "@/domain/request-resource/hooks/use-delete-request-resource";
import { openDeleteRequestResourceModalAtom } from "@/domain/request-resource/state/request-resource.atom";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DeleteResourceEvent {
  resourceRequestId: number;
  workspaceName: string;
}

/**
 * 리소스 요청 취소(삭제) 모달 컴포넌트
 *
 * 선택한 리소스 요청을 취소할 수 있는 모달입니다.
 * 취소 완료 시 목록이 자동으로 갱신됩니다.
 */
export function DeleteRequestResourceModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteRequestResourceModalAtom,
  );

  // 삭제할 리소스 요청 ID
  const [resourceRequestId, setResourceRequestId] = useState<number | null>(
    null,
  );

  // TODO: Orval API 연동 필요
  // const deleteRequestResource = useDeleteRequestResource();
  const deleteRequestResource = {
    mutate: (
      _resourceRequestId: number,
      _options?: { onSuccess?: () => void },
    ) => {
      console.log("TODO: Orval API 연동 필요");
    },
    isPending: false,
  };

  /**
   * 폼 제출 처리 함수
   *
   * 리소스 요청 취소를 실행하고 모달을 닫습니다.
   * 취소 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    if (!resourceRequestId) {
      toast.error("취소할 리소스 요청을 선택해 주세요.");
      return;
    }

    deleteRequestResource.mutate(resourceRequestId, {
      onSuccess: () => {
        toast.success("리소스 요청이 취소되었습니다.");
        onClose();
      },
    });
  };

  /**
   * 리소스 요청 취소 모달 데이터 구독
   */
  useSubscribe<DeleteResourceEvent>(
    WORKSPACE_EVENTS.sendDeleteResource,
    (eventData) => {
      // 삭제할 리소스 요청 ID 설정
      setResourceRequestId(eventData.resourceRequestId);
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
      okText="요청 취소"
      title="리소스 요청 취소"
      centered
      okButtonProps={{
        loading: deleteRequestResource.isPending,
      }}
    >
      <div>리소스 요청을 취소하시겠습니까? 요청을 취소하면</div>
      <div>관리자에게 해당 요청이 전달되지 않으며,</div>
      <div>새로운 리소스 요청을 다시 진행하실 수 있습니다.</div>
    </Modal>
  );
}
