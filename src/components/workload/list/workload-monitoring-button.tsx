"use client";

import { usePathname } from "next/navigation";

import { ColumnRouteIcon } from "@/components/common/columns/column-route-icon";
import { isAdminMode } from "@/utils/common/router.util";

interface WorkloadMonitoringButtonProps {
  workspaceId: string;
  workloadId: string;
  disabled: boolean;
}

export function WorkloadMonitoringButton({
  workspaceId,
  workloadId,
  disabled,
}: WorkloadMonitoringButtonProps) {
  const pathname = usePathname();

  const isAdmin = isAdminMode(pathname);

  let href = `/standard/workload/${workloadId}/monitoring?workspaceId=${workspaceId}`;
  if (isAdmin) {
    href = `/admin/workspace/workload/${workloadId}/monitoring?workspaceId=${workspaceId}`;
  }

  return (
    <ColumnRouteIcon
      icon="Monitoring02"
      iconSize={16}
      href={href}
      disabled={disabled}
    />
  );
}
