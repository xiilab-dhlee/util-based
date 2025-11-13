import { css } from "styled-components";

// 상세 페이지 툴바 버튼 스타일 mixin
export const toolButtonStyle = css`
  border-radius: 2px;
  border: 1px solid #b9bec3;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: #000;
  font-size: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  --icon-fill: #404040;
`;

// MyDropdown 버튼 스타일 mixin
export const myDropdownButtonStyle = css`
  width: 114px;
  height: 34px;
  padding: 10px 9px;
  color: #363b47;
  font-weight: 400;
  font-size: 12px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
    color: #544ad8;
    font-weight: 600;
  }

  &:disabled {
    color: #999;
    cursor: not-allowed;
  }
`;

// 그라데이션 배경 버튼 스타일 mixin
export const gradientBackgroundButtonStyle = css`
  position: relative;
  width: 100%;
  height: 34px;
  border: none;
  color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  font-weight: 600;
  font-size: 13px;
  border-radius: 2px;
  background: radial-gradient(
    44.5% 74.04% at 50% 50%,
    rgba(29, 78, 255, 0.3) 0.36%,
    rgba(148, 194, 255, 0.3) 100%
  );
  box-shadow: 0px 4px 4px 0px #0000004d;
  backdrop-filter: blur(3px);

  /* Gradient border using pseudo-element */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 2px;
    padding: 1px; /* border width */
    background: linear-gradient(180deg, #eef4ff -21.6%, #71a7ff 106.6%);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
    pointer-events: none;
  }
`;
