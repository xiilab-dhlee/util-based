import type { Metadata } from "next";

import { KubernetesMonitoringMain } from "@/domain/kubernetes-monitoring/components/kubernetes-monitoring-main";

export const metadata: Metadata = {
  title: "Kubernetes Monitoring",
};

export default function AdminKubernetesMonitoringPage() {
  return <KubernetesMonitoringMain />;
}
