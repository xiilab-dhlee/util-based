import styled from "styled-components";
import { Typography } from "xiilab-ui";

/**
 * 상세 정보 모달에서 사용하는 공통 스타일 컴포넌트
 *
 * 사용처:
 * - view-image-usage-request-modal.tsx
 * - view-registry-tag-detail-modal.tsx
 */

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
`;

interface DetailLabelProps {
  $minWidth?: string;
}

export const DetailLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})<DetailLabelProps>`
  color: #484848;
  min-width: ${({ $minWidth }) => $minWidth ?? "80px"};
  margin-right: 16px;
`;

export const DetailValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
  flex: 1;
  word-break: break-all;
`;
