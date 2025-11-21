"use client";

import styled from "styled-components";

import type { CoreGuide } from "@/shared/types/core.model";

/**
 * 페이지 가이드 아이템 컴포넌트의 props 인터페이스
 */
interface PageGuideItemProps extends CoreGuide {}

/**
 * 페이지 가이드 아이템 컴포넌트
 */
export function PageGuideItem({
  icon,
  title,
  description,
}: PageGuideItemProps) {
  return (
    <Container>
      <Title>
        <TitleIconWrapper>{icon}</TitleIconWrapper>
        <span>{title}</span>
      </Title>
      <Description>
        {description.map((line, idx) => (
          <span key={line}>
            {line}
            {idx < description.length - 1 && <br />}
          </span>
        ))}
      </Description>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;

  & + & {
    border-top: 1px solid #2a3041;
    padding-top: 13px;
    margin-top: 13px;
  }
`;

const TitleIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
`;

const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 700;
  font-size: 12px;
  color: #f5f5f5;
  gap: 3px;

  --icon-fill: #fff;
`;

const Description = styled.p`
  color: #cbcbcb;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`;
