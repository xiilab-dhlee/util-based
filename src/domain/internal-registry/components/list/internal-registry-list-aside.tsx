"use client";

import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import {
  AsideDetailContainer,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";
import { InternalRegistryImageListBody } from "./internal-registry-image-list-body";

export function InternalRegistryListAside() {
  return (
    <ListPageAside $width={ASIDE_WIDTH}>
      <AsideDetailContainer>
        <AsideDetailHeader>
          <AsideDetailHeaderTitle style={{ paddingTop: 9 }}>
            컨테이너 이미지 정보
          </AsideDetailHeaderTitle>
        </AsideDetailHeader>
        <InternalRegistryImageListBody />
      </AsideDetailContainer>
    </ListPageAside>
  );
}
