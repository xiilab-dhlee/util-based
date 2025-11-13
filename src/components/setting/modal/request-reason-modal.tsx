"use client";

import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";

import {
  closeRequestReasonModalAtom,
  requestReasonDataAtom,
  requestReasonModalOpenAtom,
} from "@/atoms/setting/setting-modal.atom";

/**
 * 요청 사유 모달 컴포넌트
 *
 * 리소스 신청의 요청 사유를 표시하는 모달입니다.
 * Figma 디자인에 따라 파란색 테마로 구성되었습니다.
 */
export function RequestReasonModal() {
  const isVisible = useAtomValue(requestReasonModalOpenAtom);
  const requestData = useAtomValue(requestReasonDataAtom);
  const closeModal = useSetAtom(closeRequestReasonModalAtom);

  if (!isVisible || !requestData) {
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
              <RequestIcon />
            </IconCircle>
          </IconContainer>
          <Title>요청 사유</Title>
          <CloseButton onClick={closeModal}>
            <CloseIcon />
          </CloseButton>
        </HeaderSection>

        {/* 내용 영역 */}
        <ContentSection>
          <TextContainer>
            {requestData.reason ||
              "AstraGo 2.0 AI Learning에 사용되는 리소스가 부족하여 MEM 리소스 추가 요청드립니다."}
          </TextContainer>
        </ContentSection>
      </ModalContainer>
    </ModalOverlay>
  );
}


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
    rgba(239, 240, 255, 1) 0%,
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
  background: #3744f9;
  opacity: 0.1;
  border-radius: 20px;
`;

const IconCircle = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 24px;
  height: 24px;
  background: #3744f9;
  border-radius: 16px;
  box-shadow: 0px 1px 2px 0px rgba(92, 88, 136, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RequestIcon = styled.div`
  width: 20px;
  height: 20px;
  position: relative;

  /* 요청/문서 아이콘을 SVG로 표현 */
  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 4px;
    width: 12px;
    height: 12px;
    background: #ffffff;
    /* 문서 아이콘 모양 */
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpolyline points='14,2 14,8 20,8' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cline x1='16' y1='13' x2='8' y2='13' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cline x1='16' y1='17' x2='8' y2='17' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpolyline points='10,9 9,9 8,9' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
      no-repeat center;
    mask-size: contain;
  }

  /* 추가적인 요청 표시 (작은 점) */
  &::after {
    content: "";
    position: absolute;
    top: 8px;
    left: 7px;
    width: 6px;
    height: 4px;
    background: #ffffff;
    border: 0.2px solid #ffffff;
    border-radius: 1px;
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
