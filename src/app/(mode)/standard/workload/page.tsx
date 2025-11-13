import type { Metadata } from "next";

import { WorkloadListMain } from "@/components/workload/list/workload-list-main";

/**
 * 표준 사용자 워크로드 목록 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "워크로드 | AstraGo",
};

/**
 * 표준 사용자 워크로드 목록 페이지
 */
export default async function StandardWorkloadPage() {
  return <WorkloadListMain />;
}
