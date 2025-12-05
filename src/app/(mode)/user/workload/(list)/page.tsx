import type { Metadata } from "next";

import { WorkloadListMain } from "@/domain/workload/components/list/workload-list-main";

export const metadata: Metadata = {
  title: "Workload - 활성화",
};

export default function UserWorkloadActivePage() {
  return <WorkloadListMain />;
}
