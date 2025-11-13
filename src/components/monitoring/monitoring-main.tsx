"use client";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { MonitoringMainSection } from "@/components/monitoring/monitoring-main-section";
import { MonitoringSubSection } from "@/components/monitoring/monitoring-sub-section";
import { PageHeader } from "@/layouts/common/page-header";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "모니터링" },
];

export function MonitoringMain() {
  return (
    <>
      <PageHeader title="모니터링" icon="Dashboard" description="Monitoring">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      {/* <Container> */}
      {/* 메인 정보 섹션 */}
      <MonitoringMainSection />
      {/* 서브 정보 섹션 */}
      <MonitoringSubSection />
    </>
  );
}
