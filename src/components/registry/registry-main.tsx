"use client";

import { PageHeader } from "@/layouts/common/page-header";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import { MyBreadcrumb } from "../common/breadcrumb";
import { RegistryMainSection } from "./registry-main-section";
import { RegistrySubSection } from "./registry-sub-section";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "레지스트리" },
];

export function RegistryMain() {
  return (
    <>
      <PageHeader title="레지스트리" icon="SingleNode" description="Registry">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      <RegistryMainSection />
      <RegistrySubSection />
    </>
  );
}
