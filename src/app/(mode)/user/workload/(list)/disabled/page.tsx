import type { Metadata } from "next";

import { WorkloadDisabledMain } from "@/domain/workload/components/list/workload-disabled-main";

export const metadata: Metadata = {
  title: "Workload - 비활성화",
};

export default function UserWorkloadDisabledPage() {
  return <WorkloadDisabledMain />;
}
