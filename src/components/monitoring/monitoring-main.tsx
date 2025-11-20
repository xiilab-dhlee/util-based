"use client";

import { MonitoringMainSection } from "@/components/monitoring/monitoring-main-section";
import { MonitoringSubSection } from "@/components/monitoring/monitoring-sub-section";
import { MONITORING_MENU_ICON } from "@/constants/monitoring/monitoring.constant";
import { PageHeader } from "@/layouts/common/page-header";

export function MonitoringMain() {
  return (
    <>
      <PageHeader
        title="모니터링"
        icon={MONITORING_MENU_ICON}
        description="Monitoring"
      />
      <MonitoringMainSection />
      <MonitoringSubSection />
    </>
  );
}
