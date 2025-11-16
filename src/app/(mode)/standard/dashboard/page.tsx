import type { Metadata } from "next";

import { DashboardMain } from "@/components/dashboard/dashboard-main";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function StandardDashboardPage() {
  return <DashboardMain />;
}
