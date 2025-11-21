"use client";

import { createGlobalStyle } from "styled-components";

export const MyGlobalStyle = createGlobalStyle`
*, *::before, *::after {
  box-sizing: border-box;
}

:root {
  --dashboard-main-section-height: 448px;
  --dashboard-main-section-margin-bottom: 20px;
  --page-title-height: 70px;
  --page-margin-bottom: 50px;
  --navigation-width: 220px;
  
  --gpu-usage-color: #8a5ef3;
  --gpu-request-color: #ded0ff;
  --gpu-icon-color: #F1BEFF;

  --cpu-usage-color: #7095FF;
  --cpu-request-color: #ced3ff;
  --cpu-icon-color: #92D2FF;

  --mem-usage-color: #5FB8AE;
  --mem-request-color: #d0ffe9;
  --mem-icon-color: #9EF6DC;

  --disk-usage-color: #6ec6dc;
  --disk-request-color: #d0edff;

  --critical-text-color: #ff3737;
  --high-text-color: #ffa052;
  --medium-text-color: #366bff;
  --low-text-color: #09de5e;
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
  outline: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  border: none;
  background-color: transparent;
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
`;
