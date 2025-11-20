"use client";

import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

import { MSWProvider } from "@/shared/providers/msw-provider";
import { QueryProvider } from "@/shared/providers/query-provider";
import { ServiceProvider } from "@/shared/providers/service-provider";
import { StoreProvider } from "@/shared/providers/store-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <MSWProvider>
      <QueryProvider>
        <StoreProvider>
          <ServiceProvider>
            <ThemeProvider>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              <ToastContainer />
            </ThemeProvider>
          </ServiceProvider>
        </StoreProvider>
      </QueryProvider>
    </MSWProvider>
  );
}
