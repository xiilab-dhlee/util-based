import type { Metadata } from "next";

import { UserMonitoringMain } from "@/domain/user-monitoring/components/user-monitoring-main";

export const metadata: Metadata = {
  title: "Monitoring",
};

export default function UserMonitoringPage() {
  return <UserMonitoringMain />;
}
