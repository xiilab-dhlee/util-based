"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider as Provider } from "styled-components";
import { GlobalStyle } from "xiilab-ui";

import { MyGlobalStyle } from "@/styles/global-style";
import { lightTheme } from "@/styles/theme";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <Provider theme={lightTheme}>
      <GlobalStyle />
      <MyGlobalStyle />
      {children}
    </Provider>
  );
}
