import type { Metadata } from "next";

import { DashboardMain } from "@/domain/dashboard/components/dashboard-main";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function UserDashboardPage() {
  return <DashboardMain />;
}
