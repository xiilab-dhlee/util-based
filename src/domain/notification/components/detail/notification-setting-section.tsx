"use client";

import type { ReactNode } from "react";
import styled from "styled-components";

export interface NotificationSettingSectionProps {
  title: string;
  children: ReactNode;
  grid?: boolean;
}

export function NotificationSettingSection({
  title,
  children,
  grid = false,
}: NotificationSettingSectionProps) {
  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      {grid ? (
        <GridContent>{children}</GridContent>
      ) : (
        <SectionContent>{children}</SectionContent>
      )}
    </SectionContainer>
  );
}

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 8px;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GridContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
`;
