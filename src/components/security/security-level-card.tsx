"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { CoreSecurityLevel } from "@/types/common/core.interface";
import { getSecurityLevelInfo } from "@/utils/common/security.util";

interface RegistrySecurityResourceCardProps {
  level: CoreSecurityLevel;
  count: number;
}

export function RegistrySecurityLevelCard({
  level,
  count,
}: RegistrySecurityResourceCardProps) {
  const { icon, iconColor, engText } = getSecurityLevelInfo(level);
  return (
    <Container>
      <Left>
        <Icon name={icon} color={iconColor} />
      </Left>
      <Right>
        <Label>{engText}</Label>
        <Value>
          <Count>{count.toLocaleString()}</Count>
          <Unit>개</Unit>
        </Value>
      </Right>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;

  & + & {
    border-left: 1px solid #e0e0e0;
    padding-left: 14px;
  }
`;

const Left = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 2px;
  box-shadow: 0px 2px 4px 0px #0000000a;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Label = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;

const Value = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

const Count = styled.span`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #000;
`;

const Unit = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;
