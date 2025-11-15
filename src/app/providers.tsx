"use client";

import type { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";

import { MSWProvider } from "@/providers/msw-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ServiceProvider } from "@/providers/service-provider";
import { StoreProvider } from "@/providers/store-provider";
import { ThemeProvider } from "@/providers/theme-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <MSWProvider>
      <QueryProvider>
        <StoreProvider>
          <ServiceProvider>
            <ThemeProvider>
              {children}
              <ToastContainer />
            </ThemeProvider>
          </ServiceProvider>
        </StoreProvider>
      </QueryProvider>
    </MSWProvider>
  );
}
