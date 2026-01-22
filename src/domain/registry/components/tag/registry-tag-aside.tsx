"use client";

import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { RegistryTagIntroCard } from "./registry-tag-intro-card";

/**
 * 개인 레지스트리 태그 상세 페이지 왼쪽 영역 컴포넌트
 *
 * 1. name 파라미터로 이미지 상세 조회 (imageId 획득)
 * 2. imageId, tagId, harborImageName으로 태그 상세 조회
 */
export function RegistryTagAside() {
  return (
    <DetailPageAside>
      {/* 이미지 기본 정보 카드 */}
      <RegistryTagIntroCard />
    </DetailPageAside>
  );
}
