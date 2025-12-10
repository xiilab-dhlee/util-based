/**
 * 세그먼트 프로그레스 바 공통 스타일
 *
 * 사용처:
 * - job-type-distribution.tsx
 * - job-type-usage-time.tsx
 */
import styled from "styled-components";
import { Typography } from "xiilab-ui";

/** 세그먼트 컨텐츠 박스 */
export const SegmentContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 12px;
  gap: 8px;
  width: 100%;
`;

/** 세그먼트 정보 행 */
export const SegmentRow = styled.div`
  display: flex;
  width: 100%;
`;

/** 세그먼트 정보 아이템 */
export const SegmentInfo = styled.div<{ $width: number }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-basis: ${({ $width }) => $width}%;
  flex-shrink: 0;
  padding-left: 10px;

  &:not(:first-child) {
    border-left: 1px solid #e5e5e5;
  }
`;

/** 주요 값 텍스트 (개수 또는 시간) */
export const SegmentPrimaryText = styled(Typography.Text).attrs({
  variant: "subtitle-2-1",
})`
  color: #000000;
  font-weight: 700;
`;

/** 부가 값 텍스트 (퍼센트) */
export const SegmentSecondaryText = styled(Typography.Text).attrs({
  variant: "body-3-3",
})`
  color: #000000;
  font-size: 11px;
`;

/** 프로그레스 바 컨테이너 */
export const SegmentProgressBarContainer = styled.div`
  display: flex;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  background-color: #ffffff;
`;

/** 프로그레스 바 세그먼트 */
export const SegmentProgressBar = styled.div<{
  $color: string;
  $width: number;
  $isFirst: boolean;
  $isLast: boolean;
}>`
  position: relative;
  flex-basis: ${({ $width }) => $width}%;
  flex-shrink: 0;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${({ $isFirst }) => ($isFirst ? 0 : 1)}px;
    right: ${({ $isLast }) => ($isLast ? 0 : 1)}px;
    background-color: ${({ $color }) => $color};
    border-radius: ${({ $isFirst, $isLast }) => {
      if ($isFirst && $isLast) return "3px";
      if ($isFirst) return "3px 0 0 3px";
      if ($isLast) return "0 3px 3px 0";
      return "0";
    }};
  }
`;
