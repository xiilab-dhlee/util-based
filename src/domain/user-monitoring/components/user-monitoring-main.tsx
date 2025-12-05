"use client";

import { PageHeader } from "@/shared/components/layouts/page-header";
import { UserMonitoringMainSection } from "./user-monitoring-main-section";
import { UserMonitoringSubSection } from "./user-monitoring-sub-section";

export function UserMonitoringMain() {
  return (
    <>
      <PageHeader pageKey="user.monitoring" />
      <UserMonitoringMainSection />
      <UserMonitoringSubSection />
    </>
  );
}
