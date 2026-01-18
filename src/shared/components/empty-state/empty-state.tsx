"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { TABLE_MESSAGE } from "@/shared/constants/core.constant";

interface EmptyStateProps {
  /** 아이콘 컴포넌트 (ReactNode) */
  icon?: ReactNode;
  /** 메인 제목 */
  title?: string;
  /** 설명 내용 */
  content?: string;
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
export function EmptyState({
  icon,
  title = TABLE_MESSAGE.EMPTY,
  content,
}: EmptyStateProps) {
  return (
    <Container>
      <IconCircle>
        {icon ?? <Icon name="PriorityHigh" color="#878898" />}
      </IconCircle>
      <Title>{title}</Title>
      {content && <Content>{content}</Content>}
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
  variant: "body-1-1",
  as: "h3",
})`
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
