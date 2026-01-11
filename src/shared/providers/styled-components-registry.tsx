"use client";

import { useServerInsertedHTML } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export function StyledComponentsRegistry({ children }: PropsWithChildren) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // 서버에서만 StyleSheetManager로 감싸고, 클라이언트에서는 그대로 렌더링
  if (typeof window !== "undefined") {
    return children;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
