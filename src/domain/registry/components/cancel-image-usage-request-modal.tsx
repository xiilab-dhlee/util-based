"use client";

import { useRef } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useCancelImageUsageRequestAction } from "@/domain/registry/hooks/use-cancel-image-usage-request";
import { openCancelImageUsageRequestModalAtom } from "@/domain/setting/state/setting.atom";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 이미지 태그 사용 요청 취소 모달
 *
 * 사용자가 본인이 신청한 이미지 사용 요청을 취소할 수 있는 모달입니다.
 * 승인 대기 중인 요청만 취소할 수 있습니다.
 */
export function CancelImageUsageRequestModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openCancelImageUsageRequestModalAtom,
  );

  const usageRequestIdRef = useRef<number | null>(null);

  const cancelUsageRequestMutation = useCancelImageUsageRequestAction();
  const isPending = cancelUsageRequestMutation.isPending;

  useSubscribe<number>(REGISTRY_EVENTS.openCancelUsageRequestModal, (id) => {
    if (!id) return;
    usageRequestIdRef.current = id;
    onOpen();
  });

  const handleClose = () => {
    if (isPending) return;
    usageRequestIdRef.current = null;
    onClose();
  };

  const handleOk = () => {
    const usageRequestId = usageRequestIdRef.current;
    if (!usageRequestId) {
      toast.error("취소할 이미지 사용 요청을 선택해 주세요.");
      return;
    }

    cancelUsageRequestMutation.mutate(
      { usageRequestId },
      {
        onSuccess: () => {
          toast.success("이미지 사용 요청이 취소되었습니다.");
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
      title="이미지 사용 요청 취소"
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
      이미지 사용 요청을 취소하시겠습니까?
      <br />
      요청을 취소하면 관리자에게 해당 요청이 전달되지 않으며,
      <br />
      새로운 이미지 사용 요청을 다시 진행하실 수 있습니다.
    </Modal>
  );
}
