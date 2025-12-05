"use client";

import { TooltipHighlightText } from "@/styles/mixins/text";

export function VolumeMountPathTooltipTitle() {
  return (
    <>
      컨테이너 안에서 선택한&nbsp;
      <TooltipHighlightText>Volume의 디렉토리</TooltipHighlightText>가
      마운트되는 경로입니다.
    </>
  );
}
