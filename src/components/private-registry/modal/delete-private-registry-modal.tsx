"use client";

import styled from "styled-components";
import { Modal, Typography } from "xiilab-ui";

interface DeletePrivateRegistryModalProps {
  /** Whether modal is visible */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when delete confirmed */
  onConfirm: () => void;
}

/**
 * 내부 레지스트리 이미지 삭제 모달
 */
export function DeletePrivateRegistryModal({
  open,
  onClose,
  onConfirm,
}: DeletePrivateRegistryModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      title=""
      centered
      width={300}
      okText="삭제"
      cancelText="취소"
      okType="danger"
    >
      <ModalContent>
        <IconContainer>
          <IconBlur />
          <IconCircle>
            <DeleteIcon viewBox="0 0 10 12">
              <path d="M3.5 0.5H6.5V1H9V2H8V10C8 10.5523 7.55228 11 7 11H3C2.44772 11 2 10.5523 2 10V2H1V1H3.5V0.5ZM3 2V10H7V2H3ZM4 3V9H5V3H4ZM5 3V9H6V3H5Z" />
            </DeleteIcon>
          </IconCircle>
        </IconContainer>
        <Title>내부 레지스트리 이미지 삭제</Title>
        <Message>
          선택한 내부 레지스트리 이미지와 포함된 태그를
          <br />
          모두 삭제하시겠습니까?
        </Message>
      </ModalContent>
    </Modal>
  );
}


const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
`;

const IconContainer = styled.div`
  width: 30px;
  height: 30px;
  position: relative;
  margin-bottom: 16px;
`;

const IconBlur = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  background-color: #ff4225;
  opacity: 0.1;
  border-radius: 15px;
`;

const IconCircle = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background-color: #ff4225;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 1px 2px 0px rgba(92, 88, 136, 0.15);
`;

const DeleteIcon = styled.svg`
  width: 10px;
  height: 12px;
  fill: white;
`;

const Title = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "h3",
})`
  font-weight: 700; // Keep 700 weight
  font-size: 14px; // Keep custom 14px
  line-height: 1.29;
  color: #000000;
  margin: 0 0 16px 0;
  text-align: center;
`;

const Message = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "p",
})`
  line-height: 1.5;
  color: #000000;
  margin: 0 0 20px 0;
  text-align: center;
`;
