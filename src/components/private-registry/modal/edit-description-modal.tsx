"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Icon, Input, Modal } from "xiilab-ui";

interface EditDescriptionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
  initialDescription?: string;
}

export function EditDescriptionModal({
  open,
  onClose,
  onSubmit,
  initialDescription = "",
}: EditDescriptionModalProps) {
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  const handleSubmit = () => {
    onSubmit(description);
    onClose();
  };

  const handleCancel = () => {
    setDescription(initialDescription);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={
        <ModalFooter>
          <CancelButton onClick={handleCancel}>취소</CancelButton>
          <SubmitButton onClick={handleSubmit}>수정 완료</SubmitButton>
        </ModalFooter>
      }
      closable={true}
      modalWidth={370}
      centered
      title="설명 수정"
      icon={<Icon name="Edit02" color="#fff" size={14} />}
      type="primary"
      showHeaderBorder={true}
      getContainer={() => document.body}
      zIndex={1050}
    >
      <ModalBody>
        <FormSection>
          <Label>컨테이너 이미지 설명</Label>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명을 입력해주세요"
            rows={6}
            style={{
              width: "100%",
              height: "158px",
              fontSize: "12px",
              lineHeight: "1.33",
            }}
          />
        </FormSection>
      </ModalBody>
    </Modal>
  );
}


const ModalBody = styled.div`
  padding: 6px 0;
`;

const FormSection = styled.div`
  margin-bottom: 6px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 0 20px 20px;
  margin: 0;
`;

const CancelButton = styled(Button)`
  width: 162px;
  height: 34px;
  background-color: #e4e4e8;
  border: none;
  color: #070913;
  font-size: 12px;
  font-weight: 500;
  border-radius: 2px;
`;

const SubmitButton = styled(Button)`
  width: 162px;
  height: 34px;
  background-color: #4042d5;
  border: none;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 2px;
`;
