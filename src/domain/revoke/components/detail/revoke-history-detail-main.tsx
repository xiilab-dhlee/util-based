"use client";

import { RevokeHistoryDetailBody } from "./revoke-history-detail-body";
import { RevokeHistoryDetailFilter } from "./revoke-history-detail-filter";
import { RevokeHistoryDetailFooter } from "./revoke-history-detail-footer";

interface RevokeHistoryDetailMainProps {
  id: string;
}

/**
 * 리소스 회수 이력 상세 페이지 메인 컴포넌트
 *
 * 경고/회수 목록의 필터, 테이블, 페이지네이션을 포함합니다.
 */
export function RevokeHistoryDetailMain({ id }: RevokeHistoryDetailMainProps) {
  return (
    <>
      {/* 경고/회수 목록 필터 */}
      <RevokeHistoryDetailFilter id={id} />
      {/* 경고/회수 목록 테이블 */}
      <RevokeHistoryDetailBody id={id} />
      {/* 페이지네이션 */}
      <RevokeHistoryDetailFooter id={id} />
    </>
  );
}
