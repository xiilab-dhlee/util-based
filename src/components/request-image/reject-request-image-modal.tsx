"use client";

import { useRef, useState } from "react";
import { Icon, Modal, TextArea } from "xiilab-ui";

import { openRejectRequestImageModalAtom } from "@/atoms/request-image/request-image-list.atom";
import pubsubConstants from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import type { RequestImageListType } from "@/schemas/request-image.schema";
import { ModalDescription } from "@/styles/layers/modal-layers.styled";
import type { UpdateRequestImagePayload } from "@/types/request-image/request-image.type";
import FormItem from "../common/form/form-item";
import FormLabel from "../common/form/form-label";

export function RejectRequestImageModal() {
  const formRef = useRef<HTMLFormElement>(null);
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openRejectRequestImageModalAtom,
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
      reason: formData.get("rejectReason") as string,
    };
  };

  useSubscribe<RequestImageListType>(
    pubsubConstants.requestImage.sendRejectImage,
    (eventData: any) => {
      setId(eventData.id);
      onOpen();
    },
  );

  return (
    <Modal
      modalWidth={370}
      type="danger"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      open={open}
      closable
      title="이미지 사용 반려"
      onCancel={onClose}
      showCancelButton
      cancelText="취소"
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <ModalDescription>
        사용자가 제출한 이미지 사용 요청이 반려될 경우, 해당 이미지는 사용이
        제한됩니다. 이때 관리자는 반려 사유를 반드시 입력해야 합니다.
      </ModalDescription>
      <form ref={formRef}>
        <FormItem>
          <FormLabel htmlFor="approveReason">반려 사유</FormLabel>
          <TextArea
            id="rejectReason"
            name="rejectReason"
            placeholder="이미지 사용 요청 반류 사유를 입력해 주세요."
            width="100%"
            rows={4}
          />
        </FormItem>
      </form>
    </Modal>
  );
}

