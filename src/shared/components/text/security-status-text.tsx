"use client";
import classNames from "classnames";
import type { PropsWithChildren } from "react";
import styled from "styled-components";

import type { CoreSecurityLevel } from "@/shared/types/core.interface";
import { getSecurityLevelInfo } from "@/shared/utils/security.util";
import { statusTextStyle } from "@/styles/mixins/text";

interface SecurityStatusLevelProps {
  // 보안 상태
  status: CoreSecurityLevel;
  type?: "text" | "engText";
}
// 보안 상태 텍스트
export function SecurityLevelText({
  status,
  children,
  type = "text",
}: PropsWithChildren<SecurityStatusLevelProps>) {
  const { className, ...rest } = getSecurityLevelInfo(status);
  return (
    <Container className={classNames(className)}>
      {rest[type]}
      {children}
    </Container>
  );
}

const Container = styled.span`
  ${statusTextStyle()}

  font-weight: 500;
`;
