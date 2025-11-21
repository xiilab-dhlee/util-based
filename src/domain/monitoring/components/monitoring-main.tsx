"use client";

import { MonitoringMainSection } from "@/domain/monitoring/components/monitoring-main-section";
import { MonitoringSubSection } from "@/domain/monitoring/components/monitoring-sub-section";
import { PageHeader } from "@/shared/components/layouts/page-header";

export function MonitoringMain() {
  return (
    <>
      <PageHeader pageKey="admin.monitoring" description="Monitoring" />
      <MonitoringMainSection />
      <MonitoringSubSection />
    </>
  );
}
