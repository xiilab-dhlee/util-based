"use client";

import { RegistryMainSection } from "@/domain/registry/components/entry/registry-main-section";
import { RegistrySubSection } from "@/domain/registry/components/entry/registry-sub-section";
import { SecurityLevelSettingModal } from "@/domain/registry/components/security-level-setting-modal";
import { PageHeader } from "@/shared/components/layouts/page-header";

export function RegistryMain() {
  return (
    <>
      <PageHeader pageKey="admin.registry" description="Registry" />
      <RegistryMainSection />
      <RegistrySubSection />
      {/* 보안 레벨 설정 모달 */}
      <SecurityLevelSettingModal />
    </>
  );
}
