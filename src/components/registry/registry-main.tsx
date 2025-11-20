"use client";

import { PageHeader } from "@/layouts/common/page-header";
import { RegistryMainSection } from "./registry-main-section";
import { RegistrySubSection } from "./registry-sub-section";

export function RegistryMain() {
  return (
    <>
      <PageHeader
        title="레지스트리"
        icon="Image"
        description="Registry"
        breadcrumbKey="admin.registry"
      />
      <RegistryMainSection />
      <RegistrySubSection />
    </>
  );
}
