"use client";

import { TooltipHighlightText } from "@/styles/mixins/text";

export function SingleNodeTooltipTitle() {
  return (
    <>
      프로젝트가&nbsp;
      <TooltipHighlightText>단일 노드</TooltipHighlightText>
      에서 실행.
    </>
  );
}
