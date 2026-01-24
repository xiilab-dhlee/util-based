"use client";

import { RevokeHistoryCriteriaCard } from "@/domain/revoke/components/detail/revoke-history-criteria-card";
import { RevokeHistoryDetailInfoCard } from "@/domain/revoke/components/detail/revoke-history-detail-info-card";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";

/**
 * 리소스 회수 이력 상세 페이지의 공통 사이드바 컴포넌트
 *
 * 회수 이력 상세 정보와 리소스 회수 기준을 표시합니다.
 */
export function RevokeHistoryDetailPageAside() {
  return (
    <DetailPageAside>
      {/* 리소스 회수 이력 상세 정보 (추후 별도 API 연동 예정) */}
      <RevokeHistoryDetailInfoCard />
      {/* 리소스 회수 기준 (API 호출) */}
      <RevokeHistoryCriteriaCard />
    </DetailPageAside>
  );
}
