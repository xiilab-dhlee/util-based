"use client";

import type { LabelColorVariant } from "xiilab-ui";
import { Label } from "xiilab-ui";

interface NodeStatusTextProps {
  status: boolean;
  text: string;
}
// 노드 상태 텍스트
export function NodeStatusText({ status, text }: NodeStatusTextProps) {
  const variant = status ? "green" : "red";

  return <Label variant={variant as LabelColorVariant}>{text}</Label>;
}
