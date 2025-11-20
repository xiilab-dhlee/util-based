"use client";

import { PageHeader } from "@/shared/layouts/common/page-header";
import { DashboardMainSection } from "./dashboard-main-section";
import { DashboardSubSection } from "./dashboard-sub-section";

export function DashboardMain() {
  return (
    <>
      <PageHeader
        pageKey="user.monitoring"
        description="필요한 정보를 한눈에 확인할 수 있는 메인 모니터링입니다."
      />
      <DashboardMainSection />
      <DashboardSubSection />
    </>
  );
}
