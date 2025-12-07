"use client";

import { AsideHub } from "@/domain/hub/components/detail/aside-hub";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";

export function HubListMain() {
  return (
    <ListPageAside $width={ASIDE_WIDTH}>
      <AsideHub />
    </ListPageAside>
  );
}
