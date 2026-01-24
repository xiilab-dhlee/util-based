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
  /** 다크 모드 여부 (기본: false) */
  darkMode?: boolean;
}

export function EmptyState({
  icon,
  title = TABLE_MESSAGE.EMPTY,
  content,
  darkMode = false,
}: EmptyStateProps) {
  return (
    <Container>
      <IconCircle>
        {icon ?? <Icon name="PriorityHigh" color="#878898" />}
      </IconCircle>
      <Title $darkMode={darkMode}>{title}</Title>
      {content ? <Content $darkMode={darkMode}>{content}</Content> : null}
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
})<{ $darkMode: boolean }>`
  color: ${({ $darkMode }) => ($darkMode ? "#c5c6c8" : "#333333")};
  margin: 0;
  text-align: center;
  margin-top: 20px; /* 아이콘부터 타이틀까지 20px */
`;

const Content = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
  as: "p",
})<{ $darkMode: boolean }>`
  color: ${({ $darkMode }) => ($darkMode ? "#c5c6c8" : "#666666")};
  margin: 0;
  text-align: center;
  line-height: 1.5;
  margin-top: 8px; /* 타이틀부터 내용까지 8px */
`;
