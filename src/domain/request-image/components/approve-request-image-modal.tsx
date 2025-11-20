"use client";

import { useRef, useState } from "react";
import { Icon, Modal, TextArea } from "xiilab-ui";

import type { RequestImageListType } from "@/domain/request-image/schemas/request-image.schema";
import { openApproveRequestImageModalAtom } from "@/domain/request-image/state/request-image.atom";
import type { UpdateRequestImagePayload } from "@/domain/request-image/types/request-image.type";
import { FormLabel } from "@/shared/components/form/form-label";
import { REQUEST_IMAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { FormItem } from "@/styles/layers/form-layer.styled";
import { ModalDescription } from "@/styles/layers/modal-layers.styled";

export function ApproveRequestImageModal() {
  const formRef = useRef<HTMLFormElement>(null);
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openApproveRequestImageModalAtom,
  );
  // 압축할 파일 경로 목록
  const [id, setId] = useState<string>("");

  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
    }
  };

  const createPayload = (): UpdateRequestImagePayload | null => {
    if (!formRef.current) return null;
    const formData = new FormData(formRef.current);

    return {
      id,
      reason: formData.get("approveReason") as string,
    };
  };

  useSubscribe(
    REQUEST_IMAGE_EVENTS.sendApproveImage,
    (eventData: RequestImageListType) => {
      setId(eventData.id);
      onOpen();
    },
  );

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      open={open}
      closable
      title="이미지 사용 승인"
      onCancel={onClose}
      showCancelButton
      cancelText="취소"
      okText="수정 완료"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <ModalDescription>
        사용자가 제출한 이미지 사용 요청을 승인할 경우, 해당 이미지를 사용할 수
        있습니다. 이때 관리자는 승인 사유를 입력할 수 있습니다.
      </ModalDescription>
      <form ref={formRef}>
        {/* 마운트 경로 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="approveReason">승인 사유</FormLabel>
          <TextArea
            id="approveReason"
            name="approveReason"
            placeholder="이미지 사용 요청 승인 사유를 입력해 주세요."
            width="100%"
            rows={4}
          />
        </FormItem>
      </form>
    </Modal>
  );
}
