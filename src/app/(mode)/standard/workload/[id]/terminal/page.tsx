import type { Metadata } from "next";

import { WorkloadTerminalMain } from "@/components/workload/terminal/workload-terminal-main";

export const metadata: Metadata = {
  title: "워크로드 상세",
};
/**
 * 표준 사용자 워크로드 터미널 페이지
 */
export default function StandardWorkloadTerminalPage() {
  return <WorkloadTerminalMain />;
}
