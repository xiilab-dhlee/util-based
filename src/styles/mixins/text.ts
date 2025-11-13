import { css } from "styled-components";

import { statusColorStyle } from "./color";

/**
 * 서브타이틀 스타일
 * 왼쪽에 파란색 선이 있는 섹션 제목
 *
 * lineGap: 선과 텍스트 사이의 간격 (px)
 *
 */
export const subTitleStyle = (lineGap: number) => css`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  line-height: 1.5;
  font-weight: 700;
  color: #000;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: ${lineGap * -1}px;
    width: 2px;
    height: 50%;
    background: rgba(31, 91, 255, 0.8);
    transform: translateY(-50%);
  }
`;

/**
 * 상태 텍스트 스타일
 *
 * dotSize: 점의 크기 (px)
 */
export const statusTextStyle = (dotSize = 6) => css`
  ${statusColorStyle}

  text-align: right;
  position: relative;
  line-height: 1;
  font-size: 12px;
  font-weight: 600;

  &::before {
    position: absolute;
    top: 50%;
    left: ${Math.abs(dotSize + 4) * -1}px;
    transform: translateY(-50%);
    border-radius: 50%;
    content: "";
    width: ${dotSize}px;
    height: ${dotSize}px;
    background-color: var(--status-dot-color);
  }
`;
/**
 * 필수 텍스트 스타일
 */
export const requiredTextStyle = css`
  position: relative;

  &.required::after {
    position: absolute;
    top: 50%;
    left: calc(100% + 7px);
    transform: translate(-50%, -50%);
    content: "*";
    color: #ff2c2c;
    font-size: 16px;
    font-weight: 700;
    padding-top: 4px;
  }
`;
