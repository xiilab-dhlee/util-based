"use client";

import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";
import RegistryImageVulnerabilityListBody from "./registry-image-tag-vulnerability-list-body";
import RegistryImageVulnerabilityListFilter from "./registry-image-tag-vulnerability-list-filter";

export function RegistryImageDetailAside() {
  return (
    <ListPageAside $width={620}>
      <AsideDetailContainer>
        <RegistryImageVulnerabilityListFilter />
        <RegistryImageVulnerabilityListBody />
      </AsideDetailContainer>
    </ListPageAside>
  );
}

