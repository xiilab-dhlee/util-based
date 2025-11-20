"use client";

import { AsideVolume } from "@/domain/volume/components/detail/aside-volume";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";

/**
 * 볼륨 상세 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 볼륨 목록을 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 볼륨 생성 가이드, 필터링, 목록 표시, 페이지네이션 등의 기능을 포함합니다.
 *
 * @returns 볼륨 목록 페이지 JSX
 */
export function VolumeListMain() {
  return (
    <ListPageAside $width={620}>
      <AsideVolume />
    </ListPageAside>
  );
}
