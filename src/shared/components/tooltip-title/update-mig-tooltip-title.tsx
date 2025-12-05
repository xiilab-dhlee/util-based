"use client";

import { TooltipHighlightText } from "@/styles/mixins/text";

export function UpdateMigTooltipTitle() {
  return (
    <>
      <TooltipHighlightText $colorVariant="red">
        MIG 비활성화시&nbsp;
      </TooltipHighlightText>
      더 이상 MIG 기능을 사용할 수 없습니다. <br />
      기능 설정 시&nbsp;
      <TooltipHighlightText>MIG개수</TooltipHighlightText>를{" "}
      <TooltipHighlightText>선택</TooltipHighlightText>해 주세요.
    </>
  );
}
