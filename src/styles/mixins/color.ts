import { css } from "styled-components";

/**
 * 상태 색상
 */
export const statusColorStyle = css`
  &.red {
    color: var(--red-main);
    --status-dot-color: var(--red-main);
    --status-text-color: var(--red-main);
  }

  &.green {
    color: var(--green-main);
    --status-dot-color: var(--green-main);
    --status-text-color: var(--green-main);
  }

  &.blue {
    color: var(--blue-main);
    --status-dot-color: var(--blue-main);
    --status-text-color: var(--blue-main);
  }

  &.orange {
    color: var(--orange-main);
    --status-dot-color: var(--orange-main);
    --status-text-color: var(--orange-main);
  }

  &.black {
    color: var(--gray-main);
    --status-dot-color: var(--gray-main);
    --status-text-color: var(--gray-main);
  }
`;
