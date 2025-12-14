"use client";

import { ColumnHighlightText } from "@/styles/layers/column-layer.styled";

export function SingleNodeTooltipTitle() {
  return (
    <>
      프로젝트가&nbsp;
      <ColumnHighlightText>단일 노드</ColumnHighlightText>
      에서 실행.
    </>
  );
}
