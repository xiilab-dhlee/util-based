import type { Metadata } from "next";

import { DashboardMain } from "@/domain/dashboard/components/dashboard-main";

export const metadata: Metadata = {
  title: "Monitoring",
};

export default function UserMonitoringPage() {
  return <DashboardMain />;
}
