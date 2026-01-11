"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider as Provider } from "styled-components";
import { GlobalStyle } from "xiilab-ui";

import { StyledComponentsRegistry } from "@/shared/providers/styled-components-registry";
import { MyGlobalStyle } from "@/styles/global-style";
import { lightTheme } from "@/styles/theme";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <StyledComponentsRegistry>
      <Provider theme={lightTheme}>
        <GlobalStyle />
        <MyGlobalStyle />
        {children}
      </Provider>
    </StyledComponentsRegistry>
  );
}
