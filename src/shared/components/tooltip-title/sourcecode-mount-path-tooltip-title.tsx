"use client";

import { TooltipHighlightText } from "@/styles/mixins/text";

export function SourcecodeMountPathTooltipTitle() {
  return (
    <>
      컨테이너 안에서 선택한&nbsp;
      <TooltipHighlightText>소스코드의 디렉토리</TooltipHighlightText>가
      마운트되는 경로입니다.
    </>
  );
}
