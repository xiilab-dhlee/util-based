"use client";

import { RegistryTagInfoPanel } from "@/domain/registry/components/tag/registry-tag-info-panel";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";

interface RegistryTagAsideProps {
  mode: RegistryMode;
}

/**
 * 레지스트리 태그 상세 페이지 왼쪽 영역 컴포넌트
 *
 * 1. name 파라미터로 이미지 상세 조회 (imageId 획득)
 * 2. imageId, tagId, harborImageName으로 태그 상세 조회
 */
export function RegistryTagAside({ mode }: RegistryTagAsideProps) {
  return (
    <DetailPageAside>
      {/* 이미지 기본 정보 카드 */}
      <RegistryTagInfoPanel mode={mode} />
    </DetailPageAside>
  );
}
