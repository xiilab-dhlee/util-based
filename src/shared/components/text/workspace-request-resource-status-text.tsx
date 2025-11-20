"use client";

import type { LabelColorVariant } from "xiilab-ui";
import { Label } from "xiilab-ui";

import type { WorkspaceRequestResourceStatus } from "@/domain/workspace/types/workspace.interface";
import { getRequestResourceStatusInfo } from "@/domain/workspace/utils/workspace.util";

interface WorkspaceRequestResourceStatusTextProps {
  status: WorkspaceRequestResourceStatus;
}

export function WorkspaceRequestResourceStatusText({
  status,
}: WorkspaceRequestResourceStatusTextProps) {
  const { text, color } = getRequestResourceStatusInfo(status);

  return <Label variant={color as LabelColorVariant}>{text}</Label>;
}
