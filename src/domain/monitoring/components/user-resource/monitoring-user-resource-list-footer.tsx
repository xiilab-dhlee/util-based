"use client";

import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface MonitoringUserResourceListFooterProps {
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  onChangePage: (page: number) => void;
}

export function MonitoringUserResourceListFooter({
  total,
  page,
  pageSize,
  isLoading,
  onChangePage,
}: MonitoringUserResourceListFooterProps) {
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
