import "@xterm/xterm/css/xterm.css";
import "react-toastify/dist/ReactToastify.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata, Viewport } from "next";
import type { PropsWithChildren } from "react";

import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "AstraGo",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <body className="antialiased" suppressHydrationWarning>
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
