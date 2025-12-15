"use client";

import type { RevokeHistoryDetailResponseType } from "@/domain/revoke/schemas/revoke-history.schema";
import { DetailPageAside } from "@/styles/layers/detail-page-layers.styled";
import { RevokeHistoryCriteriaCard } from "./revoke-history-criteria-card";
import { RevokeHistoryDetailInfoCard } from "./revoke-history-detail-info-card";

interface RevokeHistoryDetailPageAsideProps {
  detailData: RevokeHistoryDetailResponseType | undefined;
}

/**
 * 리소스 회수 이력 상세 페이지의 공통 사이드바 컴포넌트
 *
 * 회수 이력 상세 정보와 리소스 회수 기준을 표시합니다.
 */
export function RevokeHistoryDetailPageAside({
  detailData,
}: RevokeHistoryDetailPageAsideProps) {
  return (
    <DetailPageAside>
      {/* 리소스 회수 이력 상세 정보 */}
      <RevokeHistoryDetailInfoCard data={detailData} />
      {/* 리소스 회수 기준 (API 호출) */}
      <RevokeHistoryCriteriaCard />
    </DetailPageAside>
  );
}
