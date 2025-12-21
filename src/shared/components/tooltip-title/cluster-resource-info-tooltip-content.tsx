"use client";

import { TooltipHighlightText } from "@/styles/mixins/text";

export function ClusterResourceInfoTooltipTitle() {
  return (
    <>
      GPU 정보는&nbsp;
      <TooltipHighlightText>MIG</TooltipHighlightText>
      와&nbsp;
      <TooltipHighlightText>MPS</TooltipHighlightText>
      를&nbsp;
      <TooltipHighlightText>제외한 값</TooltipHighlightText>이 표시됩니다.
    </>
  );
}
