"use client";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface MonitoringUserResourceListFilterProps {
  total: number;
}

export function MonitoringUserResourceListFilter({
  total,
}: MonitoringUserResourceListFilterProps) {
  return <MySearchFilter title="사용자별 리소스 점유율" total={total} />;
}
