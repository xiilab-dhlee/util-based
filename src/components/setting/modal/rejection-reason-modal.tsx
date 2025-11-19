"use client";

import styled from "styled-components";
import { useAtomValue, useSetAtom } from "jotai";
import {
  rejectionReasonModalOpenAtom,
  rejectionReasonDataAtom,
  closeRejectionReasonModalAtom,
} from "@/atoms/setting/setting-modal.atom";

/**
 * 반려 사유 모달 컴포넌트
 *
 * 리소스 신청이 반려된 사유를 표시하는 모달입니다.
 * Figma 디자인에 따라 빨간색 테마로 구성되었습니다.
 */
function RejectionReasonModal() {
  const isVisible = useAtomValue(rejectionReasonModalOpenAtom);
  const rejectionData = useAtomValue(rejectionReasonDataAtom);
  const closeModal = useSetAtom(closeRejectionReasonModalAtom);

  if (!isVisible || !rejectionData) {
    return null;
  }

  return (
    <ModalOverlay>
      <ModalContainer>
        {/* 헤더 영역 */}
        <HeaderSection>
          <IconContainer>
            <IconBlur />
            <IconCircle>
              <EmergencyIcon />
            </IconCircle>
          </IconContainer>
          <Title>반려 사유</Title>
          <CloseButton onClick={closeModal}>
            <CloseIcon />
          </CloseButton>
        </HeaderSection>

        {/* 내용 영역 */}
        <ContentSection>
          <TextContainer>
            {rejectionData.rejectionReason ||
              "리소스 사용량이 권장량을 넘었습니다. 너무 많은 MEM 리소스 신청으로 리소스 신청 반려합니다."}
          </TextContainer>
        </ContentSection>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default RejectionReasonModal;

// Styled Components

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 300px;
  height: 200px;
  background: radial-gradient(
    circle at 34% 0%,
    rgba(255, 244, 247, 1) 0%,
    rgba(250, 250, 250, 1) 100%
  );
  border: 2px solid #ffffff;
  border-radius: 6px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 18px 0 18px;
  position: relative;
  gap: 4px;
`;

const IconContainer = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
`;

const IconBlur = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  background: #ff4225;
  opacity: 0.1;
  border-radius: 20px;
`;

const IconCircle = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background: #ff4225;
  border-radius: 16px;
  box-shadow: 0px 1px 2px 0px rgba(92, 88, 136, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmergencyIcon = styled.div`
  width: 20px;
  height: 20px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 4px;
    width: 12px;
    height: 12px;
    background: #ffffff;
    /* 경고 아이콘 모양을 위한 기본 스타일 */
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
      no-repeat center;
    mask-size: contain;
  }
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 14px;
  line-height: 1.2857142857142858em;
  color: #000000;
  margin: 0;
  flex: 1;
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0;

  &:hover {
    background: #f5f5f5;
  }
`;

const CloseIcon = styled.div`
  width: 12px;
  height: 12px;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 1px;
    background: #5f6368;
    transform-origin: center;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

const ContentSection = styled.div`
  padding: 14px 20px 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TextContainer = styled.div`
  width: 260px;
  height: 124px;
  background: #f3f5f7;
  border-radius: 2px;
  padding: 10px;

  font-weight: 500;
  font-size: 12px;
  line-height: 1.3333333333333333em;
  color: #000000;
  text-align: left;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;
