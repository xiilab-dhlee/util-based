"use client";

import { useAtom } from "jotai";

import { MONITORING_NOTIFICATION_PAGE_SIZE } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import { monitoringNotificationPageAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface MonitoringNotificationHistoryListFooterProps {
  total: number;
  loading: boolean;
}

export function MonitoringNotificationHistoryListFooter({
  total,
  loading,
}: MonitoringNotificationHistoryListFooterProps) {
  const [page, setPage] = useAtom(monitoringNotificationPageAtom);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={MONITORING_NOTIFICATION_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={loading}
    />
  );
}
