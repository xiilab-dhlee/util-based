"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

interface EmptyStateProps {
  /** 아이콘 컴포넌트 (ReactNode) */
  icon: ReactNode;
  /** 메인 제목 */
  title: string;
  /** 설명 내용 */
  content: string;
}

/**
 * 빈 상태를 보여주는 공통 컴포넌트
 *
 * 데이터가 없을 때 사용하는 Empty State UI입니다.
 * - 중앙 정렬된 레이아웃
 * - 아이콘, 타이틀, 내용으로 구성
 * - 일관된 간격과 스타일링
 * - 유연한 아이콘 지원 (XiilabUI, 커스텀 SVG, 다른 라이브러리 등)
 */
export function EmptyState({ icon, title, content }: EmptyStateProps) {
  return (
    <Container>
      <IconCircle>{icon}</IconCircle>
      <Title>{title}</Title>
      <Content>{content}</Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const IconCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(135, 136, 152, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "h3",
})`
  font-weight: 600; // Keep 600 weight
  font-size: 14px; // Keep custom 14px
  color: #333333;
  margin: 0;
  text-align: center;
  margin-top: 20px; /* 아이콘부터 타이틀까지 20px */
`;

const Content = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "p",
})`
  color: #666666;
  margin: 0;
  text-align: center;
  line-height: 1.5;
  margin-top: 8px; /* 타이틀부터 내용까지 8px */
`;
