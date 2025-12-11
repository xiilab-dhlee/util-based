/**
 * GPU 카드 레이아웃 공통 스타일
 *
 * 사용처:
 * - system-gpu-usage-card.tsx
 * - gpu-info-section.tsx
 */
import styled from "styled-components";
import { Typography } from "xiilab-ui";

/** 카드 내부 컨테이너 (좌우 섹션 구분) */
export const CardInnerBox = styled.div`
  display: flex;
  background-color: #ffffff;
  gap: 32px;
`;

/** 좌측 섹션 (메트릭 정보 표시) */
export const CardLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 236px;
`;

/** 우측 섹션 (차트/프로그레스 표시) */
export const CardRightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 12px;
`;

/** 메트릭 아이템 (라벨 + 값) */
export const CardMetricItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/** 메트릭 라벨 */
export const CardMetricLabel = styled(Typography.Text).attrs({
  variant: "subtitle-2-2",
})``;

/** 메트릭 값 */
export const CardMetricValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})``;

/** 수평 구분선 */
export const CardHorizontalDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e1e4e7;
  margin: 4px 0;
`;

/** 수직 구분선 */
export const CardVerticalDivider = styled.div`
  width: 1px;
  background-color: #e5e5e5;
  align-self: stretch;
`;

/** 상단 영역 (라벨 + 값 표시) */
export const CardTopArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/** 라벨과 도트를 포함한 영역 */
export const CardLabelWithDot = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

/** 컬러 도트 */
export const CardColorDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

/** 사용량 값 컨테이너 */
export const CardUsageValue = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

/** 퍼센티지 텍스트 */
export const CardUsagePercentage = styled(Typography.Text).attrs({
  variant: "title-2",
})``;
