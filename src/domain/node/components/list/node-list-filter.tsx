"use client";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface NodeListFilterProps {
  total: number;
}

/**
 * 노드 목록 페이지 상단 필터 컴포넌트
 *
 * 노드 목록 페이지에서 간단한 제목과 총 개수만 표시합니다.
 *
 * @param total - 전체 노드 수
 * @returns 노드 목록 페이지 상단 필터 컴포넌트
 */
export function NodeListFilter({ total }: NodeListFilterProps) {
  return (
    <MySearchFilter title="노드 목록" total={total}>
      {/* 검색 및 정렬 기능 제거 */}
    </MySearchFilter>
  );
}
