import type { ReactNode } from "react";

import { NODE_POSITIONS, type NodePosition } from "../types";
import { Indent, IndentBridge, IndentEnd, IndentStart } from "./indent-styles";

interface RenderAncestorIndentsParams {
  ancestorsHasNext: boolean[];
  isSingleRoot: boolean;
  nodeId: string | number;
}

export function renderAncestorIndents({
  ancestorsHasNext,
  isSingleRoot,
  nodeId,
}: RenderAncestorIndentsParams): ReactNode[] {
  return ancestorsHasNext.map((hasNext, idx) => {
    const shouldHideFirstIndent = idx === 0 && isSingleRoot;

    return (
      <Indent key={`ancestor-${nodeId}-${idx}`}>
        {!shouldHideFirstIndent && hasNext ? <IndentBridge /> : null}
      </Indent>
    );
  });
}

interface RenderCurrentLevelIndentParams {
  depth: number;
  position: NodePosition;
  isOnlyChild: boolean;
  hasParentRow: boolean;
  isSingleRoot: boolean;
}

export function renderCurrentLevelIndent({
  depth,
  position,
  isOnlyChild,
  hasParentRow,
  isSingleRoot,
}: RenderCurrentLevelIndentParams): ReactNode[] {
  if (isSingleRoot && depth === 1) {
    return [];
  }

  if (isOnlyChild && depth >= 2) {
    return [<IndentEnd key="end" />];
  }

  if (hasParentRow && depth === 1 && position === NODE_POSITIONS.FIRST) {
    return [<IndentStart key="start" />, <IndentBridge key="bridge" />];
  }

  if (position === NODE_POSITIONS.LAST) {
    return [<IndentEnd key="end" />];
  }
  if (position === NODE_POSITIONS.MIDDLE) {
    return [<IndentStart key="start" />, <IndentBridge key="bridge" />];
  }
  return depth >= 2
    ? [<IndentStart key="start" />, <IndentBridge key="bridge" />]
    : [<IndentStart key="start" />];
}
