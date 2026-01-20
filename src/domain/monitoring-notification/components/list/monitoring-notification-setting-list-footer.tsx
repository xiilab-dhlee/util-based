"use client";

import { useAtom } from "jotai";

import { MONITORING_NOTIFICATION_PAGE_SIZE } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import { monitoringNotificationSettingPageAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface MonitoringNotificationSettingListFooterProps {
  total: number;
  loading: boolean;
}

export function MonitoringNotificationSettingListFooter({
  total,
  loading,
}: MonitoringNotificationSettingListFooterProps) {
  const [page, setPage] = useAtom(monitoringNotificationSettingPageAtom);

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
