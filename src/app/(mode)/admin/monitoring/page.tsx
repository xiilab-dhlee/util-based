import type { Metadata } from "next";

import { MonitoringMain } from "@/components/monitoring/monitoring-main";

export const metadata: Metadata = {
  title: "모니터링",
};

/**
 * 관리자 모니터링 메인 페이지
 */
export default async function AdminMonitoringPage() {
  return <MonitoringMain />;
}
