import type { Metadata } from "next";

import { MonitoringMain } from "@/components/monitoring/monitoring-main";

export const metadata: Metadata = {
  title: "Monitoring",
};

export default function AdminMonitoringPage() {
  return <MonitoringMain />;
}
