"use client";

import { TooltipHighlightText } from "@/styles/mixins/text";

export function GpuUtilizationTooltipTitle() {
  return (
    <>
      <TooltipHighlightText>MIG</TooltipHighlightText>
      와&nbsp;
      <TooltipHighlightText>MPS</TooltipHighlightText>
      &nbsp;적용시 집계에 반영되지 않습니다.
    </>
  );
}
