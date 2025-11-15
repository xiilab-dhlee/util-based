import type { Metadata } from "next";

import { WorkloadListMain } from "@/components/workload/list/workload-list-main";

export const metadata: Metadata = {
  title: "Workload",
};

export default async function StandardWorkloadPage() {
  return <WorkloadListMain />;
}
