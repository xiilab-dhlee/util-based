"use client";

import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface MonitoringWorkspaceListFooterProps {
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  onChangePage: (page: number) => void;
}

export function MonitoringWorkspaceListFooter({
  total,
  page,
  pageSize,
  isLoading,
  onChangePage,
}: MonitoringWorkspaceListFooterProps) {
  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={pageSize}
      onChange={onChangePage}
      isLoading={isLoading}
    />
  );
}
