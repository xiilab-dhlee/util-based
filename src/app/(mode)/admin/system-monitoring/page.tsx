import type { Metadata } from "next";

import { SystemMonitoringMain } from "@/domain/system-monitoring/components/system-monitoring-main";

export const metadata: Metadata = {
  title: "System Monitoring",
};

export default function AdminSystemMonitoringPage() {
  return <SystemMonitoringMain />;
}
