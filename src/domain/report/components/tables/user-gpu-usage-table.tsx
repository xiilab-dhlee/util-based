import type { ReactNode } from "react";

import { createUserGpuUsageColumn } from "@/domain/report/columns/create-user-gpu-usage-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import type { UserGpuUsage } from "@/domain/report/schemas/report.schema";

interface UserGpuUsageTableProps {
  title: ReactNode;
  data: UserGpuUsage[];
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function UserGpuUsageTable({
  title,
  data,
  showToggle,
  showAll,
  onToggleShowAll,
}: UserGpuUsageTableProps) {
  const columns = createUserGpuUsageColumn<UserGpuUsage & { no: number }>();

  return (
    <ReportDataTable<UserGpuUsage>
      title={title}
      columns={columns}
      data={data}
      idField="userEmail"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
