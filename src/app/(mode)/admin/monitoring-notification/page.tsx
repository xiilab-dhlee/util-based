import type { Metadata } from "next";

import { MonitoringNotificationMain } from "@/domain/monitoring-notification/components/monitoring-notification-main";

export const metadata: Metadata = {
  title: "Monitoring Notification",
};

export default function AdminMonitoringNotificationPage() {
  return <MonitoringNotificationMain />;
}
