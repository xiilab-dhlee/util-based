"use client";

import { MonitoringMainSection } from "@/domain/monitoring/components/monitoring-main-section";
import { MonitoringSubSection } from "@/domain/monitoring/components/monitoring-sub-section";
import { MONITORING_MENU_ICON } from "@/domain/monitoring/constants/monitoring.constant";
import { PageHeader } from "@/shared/layouts/common/page-header";

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
