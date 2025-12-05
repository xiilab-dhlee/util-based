"use client";

import { WorkloadDisabledBody } from "@/domain/workload/components/list/workload-disabled-body";
import { WorkloadDisabledFilter } from "@/domain/workload/components/list/workload-disabled-filter";
import { WorkloadDisabledFooter } from "@/domain/workload/components/list/workload-disabled-footer";

/**
 * 비활성화 워크로드 목록 메인 컴포넌트
 *
 * 비활성화 워크로드 목록 페이지의 메인 콘텐츠 영역을 표시합니다.
 * (필터, 테이블, 페이지네이션)
 *
 * @returns 비활성화 워크로드 목록 메인 컴포넌트
 */
export function WorkloadDisabledMain() {
  return (
    <>
      {/* 비활성화 워크로드 목록 필터 */}
      <WorkloadDisabledFilter />
      {/* 비활성화 워크로드 목록 본문 */}
      <WorkloadDisabledBody />
      {/* 비활성화 워크로드 목록 페이지네이션 */}
      <WorkloadDisabledFooter />
    </>
  );
}
