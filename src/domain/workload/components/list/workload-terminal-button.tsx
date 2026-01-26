"use client";

import { usePathname } from "next/navigation";

import { ColumnRouteIcon } from "@/shared/components/column/column-route-icon";
import { ROUTES } from "@/shared/constants/routes.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { isAdminMode } from "@/shared/utils/router.util";

interface WorkloadTerminalButtonProps {
  workspaceId: number;
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

  const href = isAdmin
    ? ROUTES.ADMIN_WORKSPACE_WORKLOAD_TERMINAL(workloadId)
    : ROUTES.USER_WORKLOAD_TERMINAL(String(workspaceId), workloadId);

  return (
    <ColumnRouteIcon
      icon="Terminal"
      iconSize={22}
      href={href}
      disabled={disabled}
      data-testid={WORKLOAD_SELECTOR.TERMINAL_BUTTON}
    />
  );
}
