"use client";

import { AdminPrivateRegistryImageTagVulnerabilityListBody } from "@/domain/private-registry/components/detail/admin-private-registry-image-tag-vulnerability-list-body";
import { AdminPrivateRegistryImageTagVulnerabilityListFilter } from "@/domain/private-registry/components/detail/admin-private-registry-image-tag-vulnerability-list-filter";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";

export function AdminPrivateRegistryImageDetailAside() {
  return (
    <ListPageAside $width={620}>
      <AsideDetailContainer>
        <AdminPrivateRegistryImageTagVulnerabilityListFilter />
        <AdminPrivateRegistryImageTagVulnerabilityListBody />
      </AsideDetailContainer>
    </ListPageAside>
  );
}
