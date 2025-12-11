import type { ReactNode } from "react";

import { createCpuUsageWarningColumn } from "@/domain/report/columns/create-cpu-usage-warning-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import type { CpuUsageWarning } from "@/domain/report/schemas/report.schema";

interface CpuUsageWarningTableProps {
  title: ReactNode;
  data: CpuUsageWarning[];
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function CpuUsageWarningTable({
  title,
  data,
  showToggle,
  showAll,
  onToggleShowAll,
}: CpuUsageWarningTableProps) {
  const columns = createCpuUsageWarningColumn<
    CpuUsageWarning & { no: number }
  >();

  return (
    <ReportDataTable<CpuUsageWarning>
      title={title}
      columns={columns}
      data={data}
      idField="nodeName"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
