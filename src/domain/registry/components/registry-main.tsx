"use client";

import { RegistryMainSection } from "@/domain/registry/components/registry-main-section";
import { RegistrySubSection } from "@/domain/registry/components/registry-sub-section";
import { PageHeader } from "@/shared/components/layouts/page-header";

export function RegistryMain() {
  return (
    <>
      <PageHeader pageKey="admin.registry" description="Registry" />
      <RegistryMainSection />
      <RegistrySubSection />
    </>
  );
}
