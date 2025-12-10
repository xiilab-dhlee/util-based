"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

interface CustomReportCardSection {
  title?: string;
  content: ReactNode;
}

interface CustomReportCardProps {
  title?: string;
  children?: ReactNode;
  sections?: CustomReportCardSection[];
}

/**
 * card compact 버전
 * 회색 외부 컨테이너 + 타이틀 + 흰색 내부 박스 구조
 * sections가 주어질 경우, title+content 묶음을 여러 개 렌더링하며 각 묶음 사이 간격은 16px입니다.
 */
export function CustomReportCard({
  title,
  children,
  sections,
}: CustomReportCardProps) {
  const hasSections = Array.isArray(sections) && sections.length > 0;

  if (hasSections) {
    return (
      <CardContainer>
        <SectionsWrapper>
          {sections?.map((section, index) => (
            <div key={index}>
              {section.title && <CardTitle>{section.title}</CardTitle>}
              <CardBody>{section.content}</CardBody>
            </div>
          ))}
        </SectionsWrapper>
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      {title && <CardTitle>{title}</CardTitle>}
      <CardBody>{children}</CardBody>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  background-color: #f7f9fb;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 16px 10px;
  box-shadow:
    0px 4px 4px 0px rgba(171, 171, 171, 0.15),
    inset 0px 4px 4px 0px rgba(255, 255, 255, 0.25);
`;

const CardTitle = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})`
  display: block;
  margin-bottom: 10px;
  color: #191b26;
`;

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardBody = styled.div`
  background-color: #ffffff;
  border: 1px solid #e9ebee;
  border-radius: 4px;
  padding: 10px 20px;
`;
