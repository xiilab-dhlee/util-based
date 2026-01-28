"use client";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface MonitoringActiveWorkloadListFilterProps {
  total: number;
}

export function MonitoringActiveWorkloadListFilter({
  total,
}: MonitoringActiveWorkloadListFilterProps) {
  return <MySearchFilter title="활성화 워크로드 목록" total={total} />;
}
