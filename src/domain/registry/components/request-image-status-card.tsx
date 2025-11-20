import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { WorkspaceRequestResourceStatus } from "@/domain/workspace/types/workspace.interface";
import { getRequestResourceStatusInfo } from "@/domain/workspace/utils/workspace.util";

interface RequestImageStatusCardProps {
  status: WorkspaceRequestResourceStatus;
  count: number;
}

export function RequestImageStatusCard({
  status,
  count,
}: RequestImageStatusCardProps) {
  const { text, icon, iconColor } = getRequestResourceStatusInfo(status);
  return (
    <Container>
      <Left>
        <IconWrapper $borderColor={iconColor}>
          <Icon name={icon} size={24} color={iconColor} />
        </IconWrapper>
      </Left>
      <Right>
        <RightHeader>{text}</RightHeader>
        <RightBody>{count}개</RightBody>
      </Right>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  background-color: #070913;
  border: 1px solid #2a3041;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px;
  gap: 9px;
`;

const Left = styled.div`
  height: 100%;
  width: auto;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  border: 1px solid #2a3041;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px;
`;

const IconWrapper = styled.div<{ $borderColor: string }>`
  height: 100%;
  width: auto;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ $borderColor }) => $borderColor};
  background-color: #070913;
  border-radius: 2px;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RightHeader = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #c5c6c8;
  padding-bottom: 6px;
  border-bottom: 1px solid #2a3041;
`;

const RightBody = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #f5f5f5;
  padding-top: 6px;
`;
