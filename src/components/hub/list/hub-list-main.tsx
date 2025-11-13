"use client";

import { AsideHub } from "@/components/hub/detail/aside-hub";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";

/**
 * 허브 상세 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 허브 목록을 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 허브 생성 가이드, 필터링, 목록 표시, 페이지네이션 등의 기능을 포함합니다.
 *
 * @returns 허브 목록 페이지 JSX
 */
export function HubListMain() {
  return (
    <ListPageAside $width={620}>
      <AsideHub />
    </ListPageAside>
  );
}

