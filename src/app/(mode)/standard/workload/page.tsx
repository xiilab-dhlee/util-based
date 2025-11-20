import type { Metadata } from "next";

import { WorkloadListMain } from "@/domain/workload/components/list/workload-list-main";

export const metadata: Metadata = {
  title: "Workload",
};

export default function StandardWorkloadPage() {
  return <WorkloadListMain />;
}
