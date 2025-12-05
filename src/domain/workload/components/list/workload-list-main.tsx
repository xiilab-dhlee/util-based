"use client";

import { WorkloadListBody } from "@/domain/workload/components/list/workload-list-body";
import { WorkloadListFilter } from "@/domain/workload/components/list/workload-list-filter";
import { WorkloadListFooter } from "@/domain/workload/components/list/workload-list-footer";

/**
 * 활성화 워크로드 목록 메인 컴포넌트
 *
 * 활성화 워크로드 목록 페이지의 메인 콘텐츠 영역을 표시합니다.
 * (필터, 테이블, 페이지네이션)
 *
 * @returns 활성화 워크로드 목록 메인 컴포넌트
 */
export function WorkloadListMain() {
  return (
    <>
      {/* 워크로드 목록 필터 */}
      <WorkloadListFilter />
      {/* 워크로드 목록 본문 */}
      <WorkloadListBody />
      {/* 워크로드 목록 페이지네이션 */}
      <WorkloadListFooter />
    </>
  );
}
