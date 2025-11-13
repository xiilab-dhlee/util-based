"use client";

import { AsideAlert } from "@/components/alert/detail/aside-alert";
import { ListPageAside } from "@/styles/layers/list-page-layers.styled";

/**
 * 알림 상세 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 알림 목록을 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 알림 필터링, 목록 표시, 페이지네이션 등의 기능을 포함합니다.
 *
 * @returns 알림 목록 페이지 JSX
 */
export function AlertListMain() {
  return (
    <ListPageAside $width={620}>
      <AsideAlert />
    </ListPageAside>
  );
}

