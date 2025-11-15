"use client";

import { PrivateRegistryImageDetailIntroCard } from "@/components/private-registry-image/detail/private-registry-image-detail-intro-card";

/**
 * 내부 레지스트리 이미지 상세 페이지 왼쪽 영역 컴포넌트
 *
 * 이미지 기본 정보 카드를 포함합니다.
 */
export function PrivateRegistryImageDetailAside() {
  return (
    <>
      {/* 이미지 기본 정보 카드 */}
      <PrivateRegistryImageDetailIntroCard />
    </>
  );
}
