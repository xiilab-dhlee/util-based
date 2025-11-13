"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Input, Modal, Typography } from "xiilab-ui";

interface AddTagModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tag: string) => void;
}

/**
 * 태그 추가 모달 컴포넌트
 *
 * Figma 디자인 기준 370x192 크기의 태그 추가 모달
 */
export function AddTagModal({ open, onClose, onSubmit }: AddTagModalProps) {
  const [tagValue, setTagValue] = useState("");

  const handleSubmit = () => {
    if (tagValue.trim()) {
      onSubmit(tagValue.trim());
      setTagValue("");
      onClose();
    }
  };

  const handleClose = () => {
    setTagValue("");
    onClose();
  };

  return (
    <Modal
      title="태그 추가"
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="추가"
      cancelText="취소"
      closable={true}
      centered
      modalWidth={370}
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={24} />}
      getContainer={() => document.body}
      zIndex={1000}
      showHeaderBorder={true}
      okButtonProps={{ disabled: !tagValue.trim() }}
    >
      <ModalContent>
        <Description>태그를 추가하시겠습니까?</Description>

        <InputContainer>
          <StyledInput
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
            placeholder="태그를 입력해 주세요."
            onPressEnter={handleSubmit}
          />
        </InputContainer>
      </ModalContent>
    </Modal>
  );
}


// 스타일 컴포넌트들
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Description = styled(Typography.Text).attrs({
  variant: "body-2-1", // 12px, 600 weight (changed from 700 to match font-weight: 600)
})`
  line-height: 16px;
  color: #000000;
`;

const InputContainer = styled.div`
  width: 100%;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 30px;
  background: #f3f5f7;
  border: 1px solid #7095ff;
  border-radius: 2px;
  font-size: 12px;
  line-height: 16px;
  padding: 7px 10px;

  &::placeholder {
    color: #555555;
  }

  &:focus {
    border-color: #7095ff;
    outline: none;
  }
`;
