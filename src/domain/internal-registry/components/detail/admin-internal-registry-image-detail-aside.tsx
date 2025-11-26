"use client";

import { AdminInternalRegistryImageTagVulnerabilityListBody } from "@/domain/internal-registry/components/detail/admin-internal-registry-image-tag-vulnerability-list-body";
import { AdminInternalRegistryImageTagVulnerabilityListFilter } from "@/domain/internal-registry/components/detail/admin-internal-registry-image-tag-vulnerability-list-filter";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";

export function AdminInternalRegistryImageDetailAside() {
  return (
    <ListPageAside $width={620}>
      <AsideDetailContainer>
        <AdminInternalRegistryImageTagVulnerabilityListFilter />
        <AdminInternalRegistryImageTagVulnerabilityListBody />
      </AsideDetailContainer>
    </ListPageAside>
  );
}
