import type { Metadata } from "next";

import { SystemMonitoringMain } from "@/components/system-monitoring/system-monitoring-main";

export const metadata: Metadata = {
  title: "System Monitoring",
};

export default function AdminSystemMonitoringPage() {
  return <SystemMonitoringMain />;
}
