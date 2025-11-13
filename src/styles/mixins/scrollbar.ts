import { css } from "styled-components";

// 스크롤바를 숨기는 mixin
export const hideScrollbar = css`
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

// 부모 요소의 배경색을 따라가는 스크롤바 스타일 mixin
export const customScrollbar = (thumbColor = "#DDDDDD") => css`
  &::-webkit-scrollbar {
    background: transparent;
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${thumbColor};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
  scrollbar-color: ${thumbColor} transparent; /* Firefox */
`;
