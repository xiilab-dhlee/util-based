/**
 * 차트 범례 공통 스타일
 *
 * 사용처:
 * - job-type-distribution.tsx
 * - job-type-usage-time.tsx
 * - resource-usage-trend-charts.tsx
 */
import styled from "styled-components";
import { Typography } from "xiilab-ui";

/** 범례 그룹 컨테이너 */
export const LegendGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

/** 범례 아이템 */
export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

/** 범례 도트 (8px 버전 - resource-usage-trend-charts용) */
export const LegendDotLarge = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

/** 범례 도트 (6px 버전 - job-type용) */
export const LegendDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

/** 범례 텍스트 (Typography 버전) */
export const LegendText = styled(Typography.Text).attrs({
  variant: "body-3-3",
})`
  color: #222222;
`;

/** 범례 라벨 (span 버전) */
export const LegendLabel = styled.span`
  font-size: 12px;
  color: #666666;
`;
