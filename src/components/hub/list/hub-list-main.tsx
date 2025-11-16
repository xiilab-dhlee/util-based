"use client";

import { AsideHub } from "@/components/hub/detail/aside-hub";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";

export function HubListMain() {
  return (
    <ListPageAside $width={620}>
      <AsideHub />
    </ListPageAside>
  );
}
