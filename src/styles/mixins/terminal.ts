import { css } from "styled-components";

import terminalConstants from "@/constants/common/terminal.constant";

export const createTermBgClasses = (customSelector = "") => css`
  ${Object.entries(terminalConstants.themes).map(
    ([key, value]) => `
      &.${key}${customSelector ? `${customSelector}` : ""} {
        background-color: ${value.background};
        --icon-fill: ${value.foreground};
      }
    `,
  )}
`;

export const createTermFgClasses = (customSelector = "") => css`
  ${Object.entries(terminalConstants.themes).map(
    ([key, value]) => `
      &.${key}${customSelector ? `${customSelector}` : ""} {
        background-color: ${value.foreground};
        --icon-fill: ${value.background};
      }
    `,
  )}
`;
