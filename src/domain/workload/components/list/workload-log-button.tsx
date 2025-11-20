"use client";

import { usePathname } from "next/navigation";

import { ColumnRouteIcon } from "@/shared/components/column/column-route-icon";
import { isAdminMode } from "@/shared/utils/router.util";

interface WorkloadLogButtonProps {
  workspaceId: string;
  workloadId: string;
  disabled: boolean;
}

export function WorkloadLogButton({
  workspaceId,
  workloadId,
  disabled,
}: WorkloadLogButtonProps) {
  const pathname = usePathname();

  const isAdmin = isAdminMode(pathname);

  let href = `/standard/workload/${workloadId}/log?workspaceId=${workspaceId}`;
  if (isAdmin) {
    href = `/admin/workspace/workload/${workloadId}/log?workspaceId=${workspaceId}`;
  }

  return (
    <ColumnRouteIcon icon="Log" iconSize={20} href={href} disabled={disabled} />
  );
}
