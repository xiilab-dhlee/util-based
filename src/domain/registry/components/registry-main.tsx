"use client";

import { PageHeader } from "@/shared/components/layouts/page-header";
import { RegistryMainSection } from "./registry-main-section";
import { RegistrySubSection } from "./registry-sub-section";

export function RegistryMain() {
  return (
    <>
      <PageHeader pageKey="admin.registry" description="Registry" />
      <RegistryMainSection />
      <RegistrySubSection />
    </>
  );
}
