import type { Metadata } from "next";

import { WorkloadSecurityMain } from "@/components/workload/security/workload-security-main";

export const metadata: Metadata = {
  title: "워크로드 상세 | AstraGo",
};
/**
 * 관리자 워크로드 보안 페이지
 */
export default function AdminWorkloadSecurityPage() {
  return <WorkloadSecurityMain />;
}
