import type { Metadata } from "next";

import { SystemMonitoringMain } from "@/components/system-monitoring/system-monitoring-main";

export const metadata: Metadata = {
  title: "시스템 모니터링",
};

/**
 * 관리자 시스템 모니터링 메인 페이지
 */
export default async function AdminSystemMonitoringPage() {
  return <SystemMonitoringMain />;
}
