import type { Metadata } from "next";

import { MonitoringNotificationMain } from "@/components/monitoring-notification/monitoring-notification-main";

export const metadata: Metadata = {
  title: "모니터링 알림",
};

// 관리자 모니터링 알림 메인 페이지
export default function AdminMonitoringNotificationPage() {
  return <MonitoringNotificationMain />;
}
