"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Label } from "xiilab-ui";

import type { CoreSecurityLevel } from "@/shared/types/core.interface";
import { getVulnerabilityLevelInfo } from "@/shared/utils/vulnerability.util";

interface SecurityStatusLevelProps {
  status: CoreSecurityLevel;
  type?: "text" | "engText";
}
// 보안 상태 텍스트
export function SecurityLevelText({
  status,
  children,
  type = "text",
}: PropsWithChildren<SecurityStatusLevelProps>) {
  const { variant, ...rest } = getVulnerabilityLevelInfo(status);
  return (
    <Container>
      <Label variant={variant}>{rest[type]}</Label>
      {children}
    </Container>
  );
}

const Container = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
