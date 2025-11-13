import type { Metadata } from "next";

import { WorkloadLogMain } from "@/components/workload/log/workload-log-main";

export const metadata: Metadata = {
  title: "워크로드 상세 | AstraGo",
};

/**
 * 표준 사용자 워크로드 로그 페이지
 */
export default function StandardWorkloadLogPage() {
  return <WorkloadLogMain />;
}
