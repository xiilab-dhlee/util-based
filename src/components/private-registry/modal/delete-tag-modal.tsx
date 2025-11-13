"use client";

import styled from "styled-components";
import { Icon, Modal, Typography } from "xiilab-ui";

interface DeleteTagModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tagName?: string;
}

/**
 * 태그 삭제 모달 컴포넌트
 *
 * Figma 디자인 기준 300x166 크기의 태그 삭제 확인 모달
 */
export function DeleteTagModal({
  open,
  onClose,
  onConfirm,
  tagName,
}: DeleteTagModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      title="태그 삭제"
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      okText="삭제"
      cancelText="취소"
      closable={true}
      centered
      modalWidth={300}
      type="danger"
      icon={<Icon name="Delete" color="#fff" size={24} />}
      showHeaderBorder={true}
      okButtonProps={{
        style: {
          backgroundColor: "#F34C4C",
          borderColor: "#F34C4C",
          width: 126,
          height: 34,
        },
      }}
      cancelButtonProps={{
        style: {
          backgroundColor: "#E4E4E8",
          borderColor: "#E4E4E8",
          color: "#070913",
          width: 126,
          height: 34,
        },
      }}
    >
      <ModalContent>
        <Description>
          내부 레지스트리 이미지의 선택된 태그를 삭제합니다.
          <br />
          정말 삭제하시겠습니까?
        </Description>
        {tagName && (
          <TagName>
            선택된 태그: <strong>{tagName}</strong>
          </TagName>
        )}
      </ModalContent>
    </Modal>
  );
}


// 스타일 컴포넌트들
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Description = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  line-height: 18px;
  color: #000000;
`;

const TagName = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  line-height: 16px;
  color: #666;

  strong {
    color: #ff4225;
    font-weight: 600;
  }
`;
