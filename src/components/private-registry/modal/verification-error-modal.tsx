"use client";

import React from "react";
import { Modal } from "xiilab-ui";

interface VerificationErrorModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 검증 오류 모달 - 한 번에 하나의 이미지만 검증 가능함을 알리는 모달
 */
export function VerificationErrorModal({
  open,
  onClose,
}: VerificationErrorModalProps) {
  return (
    <Modal
      open={open}
      variant="error"
      title="검증 오류"
      modalWidth={300}
      onOk={onClose}
      onCancel={onClose}
      okText="확인"
      cancelButtonProps={{ style: { display: "none" } }}
      centered
      closable={true}
      maskClosable={false}
      getContainer={() => document.body}
      zIndex={1000}
    >
      한 번에 하나의 이미지만 검증 할 수 있습니다.
      <br />
      하나의 이미지를 선택 후 검증해 주세요.
    </Modal>
  );
}

