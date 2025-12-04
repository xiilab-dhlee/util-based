"use client";

import { FileSecurityScanDetailIntroCard } from "@/domain/security/components/file-security/scan/file-security-scan-detail-intro-card";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import type { CoreGuideImage } from "@/shared/types/core.model";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";

/**
 * 파일 시스템 보안 검사 상세 페이지 왼쪽 영역 컴포넌트
 *
 * 검사 기본 정보 카드와 취약점 검사 가이드를 포함합니다.
 */

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/vulnerability-guide1.png",
    alt: "취약점 검사 가이드 1",
  },
  {
    id: "2",
    src: "/images/vulnerability-guide2.png",
    alt: "취약점 검사 가이드 2",
  },
  {
    id: "3",
    src: "/images/vulnerability-guide3.png",
    alt: "취약점 검사 가이드 3",
  },
];

export function FileSecurityScanDetailAside() {
  return (
    <DetailPageAside>
      {/* 검사 기본 정보 카드 */}
      <FileSecurityScanDetailIntroCard />
      {/* 취약점 검사 가이드 */}
      <PageImageGuide title="취약점 검사 가이드" guideImages={GUIDE_IMAGES} />
    </DetailPageAside>
  );
}
