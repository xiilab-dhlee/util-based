"use client";

import { PrivateRegistryImageDetailFilter } from "@/components/private-registry-image/detail/private-registry-image-detail-filter";
import { PrivateRegistryImageDetailFooter } from "@/components/private-registry-image/detail/private-registry-image-detail-footer";
import { PrivateRegistryImageTagListBody } from "@/components/private-registry-image/detail/private-registry-image-tag-list-body";

/**
 * 내부 레지스트리 이미지 상세 페이지 오른쪽 영역 컴포넌트
 *
 * 태그 목록 필터, 본문, 페이지네이션을 포함합니다.
 */
export function PrivateRegistryImageDetailBody() {
  return (
    <>
      {/* 태그 목록 필터 */}
      <PrivateRegistryImageDetailFilter />
      {/* 태그 목록 본문 */}
      <PrivateRegistryImageTagListBody />
      {/* 태그 목록 페이지네이션 */}
      <PrivateRegistryImageDetailFooter />
    </>
  );
}
