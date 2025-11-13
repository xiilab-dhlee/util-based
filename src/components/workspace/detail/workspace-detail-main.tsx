"use client";

import { WorkloadListBody } from "@/components/workload/list/workload-list-body";
import { WorkloadListFilter } from "@/components/workload/list/workload-list-filter";
import { WorkloadListFooter } from "@/components/workload/list/workload-list-footer";

export function WorkspaceDetailMain() {
  return (
    <>
      {/* 워크로드 목록 필터 */}
      <WorkloadListFilter />
      {/* 워크로드 목록 본문 - 서버 데이터를 클라이언트 컴포넌트에 전달 */}
      <WorkloadListBody />
      {/* 워크로드 목록 페이지네이션 */}
      <WorkloadListFooter />
    </>
  );
}
