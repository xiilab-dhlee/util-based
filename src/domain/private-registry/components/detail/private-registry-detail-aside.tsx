"use client";

import { PrivateRegistryTagVulnerabilityListBody } from "@/domain/private-registry/components/detail/private-registry-tag-vulnerability-list-body";
import { PrivateRegistryTagVulnerabilityListFilter } from "@/domain/private-registry/components/detail/private-registry-tag-vulnerability-list-filter";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";

export function PrivateRegistryDetailAside() {
  return (
    <ListPageAside $width={ASIDE_WIDTH}>
      <AsideDetailContainer>
        <PrivateRegistryTagVulnerabilityListFilter />
        <PrivateRegistryTagVulnerabilityListBody />
      </AsideDetailContainer>
    </ListPageAside>
  );
}
