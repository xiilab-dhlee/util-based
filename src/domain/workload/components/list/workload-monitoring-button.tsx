"use client";

import { usePathname } from "next/navigation";

import { ColumnRouteIcon } from "@/shared/components/column/column-route-icon";
import { ROUTES } from "@/shared/constants/routes.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { isAdminMode } from "@/shared/utils/router.util";

interface WorkloadMonitoringButtonProps {
  workspaceId: number;
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

  const href = isAdmin
    ? ROUTES.ADMIN_WORKSPACE_WORKLOAD_MONITORING(workloadId)
    : ROUTES.USER_WORKLOAD_MONITORING(String(workspaceId), workloadId);

  return (
    <ColumnRouteIcon
      icon="Monitoring02"
      iconSize={16}
      href={href}
      disabled={disabled}
      data-testid={WORKLOAD_SELECTOR.MONITORING_BUTTON}
    />
  );
}
