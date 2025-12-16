"use client";

import { TooltipHighlightText } from "@/styles/mixins/text";

export function MultiNodeTooltipTitle() {
  return (
    <>
      프로젝트가&nbsp;
      <TooltipHighlightText>다중 노드</TooltipHighlightText>
      에서 실행.
      <br />
      Horovod를 이용한 분산학습 시 선택.
    </>
  );
}
