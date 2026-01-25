import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { ImageTagUsageRequestFilterRequestApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/** 상태별 UI 정보 */
interface StatusInfo {
  text: string;
  icon: string;
  iconColor: string;
  boxShadowColor: string;
}

/** 이미지 사용 요청 상태별 UI 정보 매핑 */
const IMAGE_USAGE_REQUEST_STATUS_MAP: Record<
  ImageTagUsageRequestFilterRequestApprovalStatus,
  StatusInfo
> = {
  APPROVAL_WAITING: {
    text: "대기",
    icon: "Waiting",
    iconColor: "rgba(104, 198, 75, 0.9)",
    boxShadowColor: "#5EB3465C",
  },
  APPROVED: {
    text: "승인",
    icon: "Verification02",
    iconColor: "#86B6FF",
    boxShadowColor: "#86B6FF4D",
  },
  REJECTED: {
    text: "반려",
    icon: "Error",
    iconColor: "#ff8080",
    boxShadowColor: "#FF80805C",
  },
} as const;

interface RequestImageStatusCardProps {
  status: ImageTagUsageRequestFilterRequestApprovalStatus;
  count: number;
  isLoading?: boolean;
}

export function RequestImageStatusCard({
  status,
  count,
  isLoading = false,
}: RequestImageStatusCardProps) {
  const { text, icon, iconColor, boxShadowColor } =
    IMAGE_USAGE_REQUEST_STATUS_MAP[status];
  return (
    <Container>
      <Left>
        <IconWrapper $borderColor={iconColor} $boxShadowColor={boxShadowColor}>
          <Icon name={icon} size={28} color={iconColor} />
        </IconWrapper>
      </Left>
      <Right>
        <RightHeader>{text}</RightHeader>
        <RightBody>{isLoading ? "-" : `${count.toLocaleString()}개`}</RightBody>
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

const IconWrapper = styled.div<{
  $borderColor: string;
  $boxShadowColor: string;
}>`
  height: 100%;
  width: auto;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ $borderColor }) => $borderColor};
  background-color: #070913;
  border-radius: 2px;
  box-shadow: 0px 2px 12px 0px ${({ $boxShadowColor }) => $boxShadowColor};
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
  letter-spacing: 5px;
`;

const RightBody = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #f5f5f5;
  padding-top: 6px;
`;
