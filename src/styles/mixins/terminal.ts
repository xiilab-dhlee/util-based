import { css } from "styled-components";

import { TERMINAL_THEME_LIST } from "@/shared/constants/terminal.constant";

export const createTermBgClasses = (customSelector = "") => css`
  ${Object.entries(TERMINAL_THEME_LIST).map(
    ([key, value]) => `
      &.${key}${customSelector ? `${customSelector}` : ""} {
        background-color: ${value.background};
        --icon-fill: ${value.foreground};
      }
    `,
  )}
`;

export const createTermFgClasses = (customSelector = "") => css`
  ${Object.entries(TERMINAL_THEME_LIST).map(
    ([key, value]) => `
      &.${key}${customSelector ? `${customSelector}` : ""} {
        background-color: ${value.foreground};
        --icon-fill: ${value.background};
      }
    `,
  )}
`;
