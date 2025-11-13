import { DashboardMain } from "@/components/dashboard/dashboard-main";

export const metadata = {
  title: "Dashboard | AstraGo",
  description: "AstraGo user dashboard",
};

/**
 * 표준 사용자 대시보드 페이지 (서버 컴포넌트)
 */
export default async function StandardDashboardPage() {
  return <DashboardMain />;
}
