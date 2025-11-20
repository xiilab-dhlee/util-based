"use client";

import type { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

interface SearchNoResultProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function SearchNoResult({
  icon,
  title,
  description,
  children,
}: PropsWithChildren<SearchNoResultProps>) {
  return (
    <Container>
      <IconWrapper>{icon}</IconWrapper>

      {/* 메인 제목 */}
      <BodyTitle>{title}</BodyTitle>

      {/* 설명 텍스트 */}
      <BodyDescription>{description}</BodyDescription>

      {children}
    </Container>
  );
}

// ===== Styled Components =====

/** 메인 콘텐츠 컨테이너 - 중앙 정렬된 레이아웃 */
const Container = styled.div`
  flex: 1;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

/** 아이콘 래퍼 - 원형 배경과 함께 포트 아이콘 표시 */
const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: rgba(135, 136, 152, 0.1);
  margin-bottom: 20px;
`;

/** 메인 제목 텍스트 */
const BodyTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 12px;
  text-align: center;
  color: #333333;
  margin-bottom: 8px;
`;

/** 설명 텍스트 */
const BodyDescription = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  margin-bottom: 22px;
`;
