import type { Metadata } from "next";

import { DisabledWorkloadListMain } from "@/domain/workload/components/list/disabled-workload-list-main";

export const metadata: Metadata = {
  title: "Workload",
};

export default function AdminWorkloadDisabledPage() {
  return <DisabledWorkloadListMain />;
}
