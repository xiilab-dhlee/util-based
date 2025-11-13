import type { Metadata } from "next";

import { WorkloadFileMain } from "@/components/workload/file/workload-file-main";

export const metadata: Metadata = {
  title: "워크로드 상세 | AstraGo",
};

/**
 * 관리자 워크로드 파일 페이지
 */
export default function AdminWorkloadFilePage() {
  return <WorkloadFileMain />;
}
