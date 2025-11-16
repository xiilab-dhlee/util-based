"use client";

import { MonitoringMainSection } from "@/components/monitoring/monitoring-main-section";
import { MonitoringSubSection } from "@/components/monitoring/monitoring-sub-section";
import { PageHeader } from "@/layouts/common/page-header";

export function MonitoringMain() {
  return (
    <>
      <PageHeader
        title="모니터링"
        icon="Monitoring01"
        description="Monitoring"
      />
      <MonitoringMainSection />
      <MonitoringSubSection />
    </>
  );
}
