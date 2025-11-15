import type { Metadata } from "next";

import { ClusterMonitoringMain } from "@/components/cluster-monitoring/cluster-monitoring-main";

export const metadata: Metadata = {
  title: "클러스터 모니터링",
};

// 관리자 클러스터 모니터링 메인 페이지
export default function AdminClusterMonitoringPage() {
  return <ClusterMonitoringMain />;
}
