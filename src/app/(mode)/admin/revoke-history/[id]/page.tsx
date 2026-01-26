"use client";

import { useParams } from "next/navigation";

import { RevokeHistoryDetailMain } from "@/domain/revoke/components/detail/revoke-history-detail-main";
import { RevokeHistoryDetailPageAside } from "@/domain/revoke/components/detail/revoke-history-detail-page-aside";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  DetailContentSection,
  DetailPageBody,
  DetailPageContent,
} from "@/styles/layers/detail-page-layers.styled";

/**
 * 리소스 회수 이력 상세 페이지
 *
 * 좌측 사이드바에 회수 이력 상세 정보와 회수 기준을 표시하고,
 * 우측 메인 영역에 경고/회수 목록 테이블을 표시합니다.
 */
export default function RevokeHistoryDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 네비게이션 */}
      <PageHeader
        pageKey="admin.workspace.revoke-history.detail"
        pageParams={{ id }}
        description="리소스 회수 이력 상세 정보"
      />

      {/* 상세 페이지 메인 콘텐츠 영역 */}
      <DetailPageBody>
        {/* 왼쪽 사이드바 영역 - 회수 이력 상세 정보 및 회수 기준 */}
        <RevokeHistoryDetailPageAside />
        {/* 오른쪽 메인 콘텐츠 영역 */}
        <DetailPageContent>
          {/* 경고/회수 목록 */}
          <DetailContentSection>
            <RevokeHistoryDetailMain id={id} />
          </DetailContentSection>
        </DetailPageContent>
      </DetailPageBody>
    </>
  );
}
