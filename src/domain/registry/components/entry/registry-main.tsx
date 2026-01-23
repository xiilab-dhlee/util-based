"use client";

import { RegistryMainSection } from "@/domain/registry/components/entry/registry-main-section";
import { RegistrySubSection } from "@/domain/registry/components/entry/registry-sub-section";
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
