"use client";

import { usePathname } from "next/navigation";

import { ColumnRouteIcon } from "@/shared/components/column/column-route-icon";
import { isAdminMode } from "@/shared/utils/router.util";

interface WorkloadTerminalButtonProps {
  workspaceId: string;
  workloadId: string;
  disabled: boolean;
}

export function WorkloadTerminalButton({
  workspaceId,
  workloadId,
  disabled,
}: WorkloadTerminalButtonProps) {
  const pathname = usePathname();

  const isAdmin = isAdminMode(pathname);

  let href = `/user/workload/${workloadId}/terminal?workspaceId=${workspaceId}`;
  if (isAdmin) {
    href = `/admin/workspace/workload/${workloadId}/terminal?workspaceId=${workspaceId}`;
  }

  return (
    <ColumnRouteIcon
      icon="Terminal"
      iconSize={22}
      href={href}
      disabled={disabled}
    />
  );
}
