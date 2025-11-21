"use client";

import { PageHeader } from "@/shared/layouts/common/page-header";
import { UserMonitoringMainSection } from "./user-monitoring-main-section";
import { UserMonitoringSubSection } from "./user-monitoring-sub-section";

export function UserMonitoringMain() {
  return (
    <>
      <PageHeader
        pageKey="user.monitoring"
        description="필요한 정보를 한눈에 확인할 수 있는 메인 모니터링입니다."
      />
      <UserMonitoringMainSection />
      <UserMonitoringSubSection />
    </>
  );
}
