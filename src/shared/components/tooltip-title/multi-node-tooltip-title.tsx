"use client";

import { ColumnHighlightText } from "@/styles/layers/column-layer.styled";

export function MultiNodeTooltipTitle() {
  return (
    <>
      프로젝트가&nbsp;
      <ColumnHighlightText>다중 노드</ColumnHighlightText>
      에서 실행.
      <br />
      Horovod를 이용한 분산학습 시 선택.
    </>
  );
}
