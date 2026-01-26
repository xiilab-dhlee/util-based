"use client";

import { UserMonitoringMainSection } from "@/domain/user-monitoring/components/user-monitoring-main-section";
import { UserMonitoringSubSection } from "@/domain/user-monitoring/components/user-monitoring-sub-section";
import { PageHeader } from "@/shared/components/layouts/page-header";

export function UserMonitoringMain() {
  return (
    <>
      <PageHeader pageKey="user.monitoring" />
      <UserMonitoringMainSection />
      <UserMonitoringSubSection />
    </>
  );
}
