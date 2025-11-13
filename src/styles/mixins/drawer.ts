import { css } from "styled-components";

// 터미널 drawer 스타일 mixin
export const terminalDrawerStyle = css`
  // drawer 컨테이너 커스터마이징
  & .ant-drawer-content-wrapper {
    // border: 1px solid #544ad8;
    border-radius: 4px;
    padding: 0;
    background: #fcfcfc;
  }
  // drawer 헤더 커스터마이징
  & .ant-drawer-header {
    padding: 0;
    margin: 0 22px;
  }
  // drawer body 커스터마이징
  & .ant-drawer-body {
    padding: 0;
  }
`;
