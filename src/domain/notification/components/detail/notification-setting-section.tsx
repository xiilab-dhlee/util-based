"use client";

import type { ReactNode } from "react";
import styled from "styled-components";

export interface NotificationSettingSectionProps {
  title: string;
  children: ReactNode;
}

export function NotificationSettingSection({
  title,
  children,
}: NotificationSettingSectionProps) {
  return (
    <SectionContainer>
      <SectionTitle>{title}</SectionTitle>
      <SectionContent>{children}</SectionContent>
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
