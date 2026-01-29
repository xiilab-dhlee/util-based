"use client";

import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface MonitoringActiveWorkloadListFooterProps {
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  onChangePage: (page: number) => void;
}

export function MonitoringActiveWorkloadListFooter({
  total,
  page,
  pageSize,
  isLoading,
  onChangePage,
}: MonitoringActiveWorkloadListFooterProps) {
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
