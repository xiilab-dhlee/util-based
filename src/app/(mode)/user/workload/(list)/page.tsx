import type { Metadata } from "next";

import { ActiveWorkloadListMain } from "@/domain/workload/components/list/active-workload-list-main";

export const metadata: Metadata = {
  title: "Workload",
};

export default function UserWorkloadActivePage() {
  return <ActiveWorkloadListMain />;
}
