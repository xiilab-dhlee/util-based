"use client";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface MonitoringWorkspaceListFilterProps {
  total: number;
}

export function MonitoringWorkspaceListFilter({
  total,
}: MonitoringWorkspaceListFilterProps) {
  return <MySearchFilter title="전체 워크스페이스" total={total} />;
}
