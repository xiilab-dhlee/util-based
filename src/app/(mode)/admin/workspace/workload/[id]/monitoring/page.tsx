import type { Metadata } from "next";

import { WorkloadMonitoringMain } from "@/components/workload/monitoring/workload-monitoring-main";

export const metadata: Metadata = {
  title: "워크로드 상세 | AstraGo",
};

/**
 * 관리자 워크로드 모니터링 페이지
 */
export default function AdminWorkloadMonitoringPage() {
  return <WorkloadMonitoringMain />;
}
