"use client";

import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

import { MySpinner } from "@/shared/components/spinner";
import { AuthProvider } from "@/shared/providers/auth-provider";
import { LicenseProvider } from "@/shared/providers/license-provider";
import { MSWProvider } from "@/shared/providers/msw-provider";
import { QueryProvider } from "@/shared/providers/query-provider";
import { ServiceProvider } from "@/shared/providers/service-provider";
import { StoreProvider } from "@/shared/providers/store-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <MSWProvider>
      <QueryProvider>
        <LicenseProvider>
          <AuthProvider>
            <StoreProvider>
              <ServiceProvider>
                <ThemeProvider>
                  <Suspense fallback={<MySpinner />}>{children}</Suspense>
                  <ToastContainer />
                </ThemeProvider>
              </ServiceProvider>
            </StoreProvider>
          </AuthProvider>
        </LicenseProvider>
      </QueryProvider>
    </MSWProvider>
  );
}
