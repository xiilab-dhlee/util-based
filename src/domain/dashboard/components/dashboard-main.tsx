"use client";

import { PageHeader } from "@/shared/components/layouts/page-header";
import { DashboardMainSection } from "./dashboard-main-section";
import { DashboardSubSection } from "./dashboard-sub-section";

export function DashboardMain() {
  return (
    <>
      <PageHeader
        title="Main Dashboard"
        icon="Dashboard"
        description="필요한 정보를 한눈에 확인할 수 있는 메인 대시보드입니다."
      />
      <DashboardMainSection />
      <DashboardSubSection />
    </>
  );
}
