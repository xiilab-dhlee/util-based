import { css } from "styled-components";

/**
 * 상태 색상
 */
export const statusColorStyle = css`
  &.red {
    color: #e85a5a;
    --status-dot-color: #ff0000;
    --status-text-color: #e85a5a;
  }

  &.green {
    color: #00911d;
    --status-dot-color: #52bc4a;
    --status-text-color: #00911d;
  }

  &.blue {
    color: #366bff;
    --status-dot-color: #2862ff;
    --status-text-color: #366bff;
  }

  &.orange {
    color: #ffa052;
    --status-dot-color: #ffa052;
    --status-text-color: #ffa052;
  }

  &.black {
    color: #070913;
    --status-dot-color: #7b7b7b;
    --status-text-color: #070913;
  }
`;
