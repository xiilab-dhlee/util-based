"use client";

import styled from "styled-components";

import { MyIcon } from "@/components/common/icon";

/**
 * 리스트가 비어있을 때 표시되는 빈 상태 컴포넌트
 * 부모 요소의 정중앙에 위치하며, 아이콘과 메시지를 표시합니다.
 */
interface ListEmptyProps {
  /** 빈 상태 제목 */
  title: string;
  /** 빈 상태 설명 메시지 */
  message?: string;
  /** 테마 */
  theme?: "dark" | "light";
}

/**
 * 리스트가 비어있을 때 표시되는 빈 상태 컴포넌트
 *
 * @param title - 빈 상태 제목
 * @param message - 빈 상태 설명 메시지
 * @returns 빈 상태 UI 컴포넌트
 */
export function ListEmpty({ title, message, theme = "light" }: ListEmptyProps) {
  return (
    <Container className={theme}>
      <Body>
        {/* 경고 아이콘을 원형 배경에 표시 */}
        <IconWrapper>
          <MyIcon name="PriorityHigh" color="var(--icon-fill)" />
        </IconWrapper>
        {/* 제목과 설명 메시지 영역 */}
        <Message>
          <Title>{title}</Title>
          {message && <Description>{message}</Description>}
        </Message>
      </Body>
    </Container>
  );
}

/** 부모 요소의 정중앙에 위치하는 컨테이너 */
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;

  --list-empty-icon-bg-color: #f0f0f2;
  --list-empty-text-color: #000;

  &.dark {
    --list-empty-icon-bg-color: #242a3d;
    --list-empty-text-color: rgba(223, 223, 224, 0.6);
  }
`;

/** 아이콘과 메시지를 세로로 정렬하는 메인 바디 */
const Body = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

/** 원형 배경에 아이콘을 표시하는 래퍼 */
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border-radius: 50%;
  background-color: var(--list-empty-icon-bg-color);
  width: 50px;
  height: 50px;

  --icon-fill: #878898;
`;

/** 제목과 설명을 세로로 정렬하는 메시지 컨테이너 */
const Message = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/** 빈 상태 제목 스타일 */
const Title = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 12px;
  text-align: center;
  color: var(--list-empty-text-color);
`;

/** 빈 상태 설명 메시지 스타일 */
const Description = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  color: var(--list-empty-text-color);
`;
