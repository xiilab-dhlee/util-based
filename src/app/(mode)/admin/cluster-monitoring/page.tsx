import type { Metadata } from "next";

import { ClusterMonitoringMain } from "@/components/cluster-monitoring/cluster-monitoring-main";

export const metadata: Metadata = {
  title: "Cluster Monitoring",
};

export default function AdminClusterMonitoringPage() {
  return <ClusterMonitoringMain />;
}
