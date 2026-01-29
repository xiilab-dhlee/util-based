"use client";

import { usePathname } from "next/navigation";

import { ColumnRouteIcon } from "@/shared/components/column/column-route-icon";
import { ROUTES } from "@/shared/constants/routes.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { isAdminMode } from "@/shared/utils/router.util";

interface WorkloadLogButtonProps {
  workspaceId: number;
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

  const href = isAdmin
    ? ROUTES.ADMIN_WORKSPACE_WORKLOAD_LOG(workspaceId, workloadId)
    : ROUTES.USER_WORKLOAD_LOG(workspaceId, workloadId);

  return (
    <ColumnRouteIcon
      icon="Log"
      iconSize={20}
      href={href}
      disabled={disabled}
      data-testid={WORKLOAD_SELECTOR.LOG_BUTTON}
    />
  );
}
