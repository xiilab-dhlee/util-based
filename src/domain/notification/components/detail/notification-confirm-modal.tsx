"use client";

import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";

export interface NotificationConfirmModalProps {
  open: boolean;
  title: string;
  pendingValue: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function NotificationConfirmModal({
  open,
  title,
  pendingValue,
  onConfirm,
  onCancel,
}: NotificationConfirmModalProps) {
  return (
    <Modal
      type="primary"
      icon={<Icon name="Noti" color="#fff" size={18} />}
      modalWidth={300}
      open={open}
      closable
      title={title}
      showCancelButton
      cancelText="취소"
      onCancel={onCancel}
      okText="확인"
      onOk={onConfirm}
      centered
    >
      <ConfirmMessage>
        {title}을(를) {pendingValue ? "on" : "off"}으로 변경하시겠습니까?
      </ConfirmMessage>
    </Modal>
  );
}

const ConfirmMessage = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #000;
  text-align: left;
`;
