"use client";

import { TooltipHighlightText } from "@/styles/mixins/text";

export function GpuUtilizationTooltipTitle() {
  return (
    <>
      <TooltipHighlightText>MIG</TooltipHighlightText>
      &nbsp;적용 시 집계에 반영되지 않습니다.
    </>
  );
}
