"use client";

import { createGlobalStyle } from "styled-components";

export const MyGlobalStyle = createGlobalStyle`
*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  --user-monitoring-main-section-height: 448px;
  --user-monitoring-main-section-margin-bottom: 20px;
  --page-title-height: 70px;
  --page-margin-bottom: 50px;
  /** 페이지 내부 패딩 */
  --page-inner-padding: 40px;
  --navigation-width: 220px;

  --gpu-usage-color: #8B59FF;
  --gpu-request-color: #CCB7FF;
  --gpu-icon-color: #F1BEFF;

  --cpu-usage-color: #6459FF;
  --cpu-request-color: #B7CAFF;
  --cpu-icon-color: #92D2FF;

  --mem-usage-color: #007D43;
  --mem-request-color: #6ADFC7;
  --mem-icon-color: #9EF6DC;

  --disk-usage-color: #1FB2ED;
  --disk-request-color: #C7EAFF;

  --red-main: var(--color-red-07);
  --orange-main: var(--color-orange-07); 
  --light-blue-main: var(--color-light-blue-05); 
  --dark-blue-main: var(--color-dark-blue-01);
  --green-main: var(--color-green-06); 
  --dark-green-main: var(--color-dark-green-03); 
  --light-green-main: var(--color-light-green-03);
  --gray-main: var(--color-gray-06);
  --blue-main: var(--color-blue-04);
  --purple-main: var(--color-purple-04); 

}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

html {
  font-size: 10px;
}

body {
  font-size: 1rem;
  color: #17171f;
  background: #f6f6f9;
  letter-spacing: -0.03rem;
  overflow: hidden;
}
// button의 기본 스타일 초기화
button {
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: none;
  background-color: transparent;

  /* 마우스 클릭 시에는 outline 제거 */
  outline: none;
  
  /* 키보드 탭 포커스 시에만 outline 표시 */
  &:focus-visible {
    outline: 1px solid var(--color-blue-04);
    outline-offset: 0px;
  }
}

.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pointer {
  cursor: pointer;
}

.tooltip-icon {
  cursor: help;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
}

.icon-button {
  background-color: transparent;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover,
  &:focus-visible {
    background-color: rgba(0, 0, 0, 0.04);
  }
}

`;
