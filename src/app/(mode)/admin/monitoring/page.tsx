import type { Metadata } from "next";

import { MonitoringMain } from "@/domain/monitoring/components/monitoring-main";

export const metadata: Metadata = {
  title: "Monitoring",
};

export default function AdminMonitoringPage() {
  return <MonitoringMain />;
}
