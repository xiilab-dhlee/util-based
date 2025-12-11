import type { ReactNode } from "react";

import { createMemoryUsageWarningColumn } from "@/domain/report/columns/create-memory-usage-warning-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import type { MemoryUsageWarning } from "@/domain/report/schemas/report.schema";

interface MemoryUsageWarningTableProps {
  title: ReactNode;
  data: MemoryUsageWarning[];
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function MemoryUsageWarningTable({
  title,
  data,
  showToggle,
  showAll,
  onToggleShowAll,
}: MemoryUsageWarningTableProps) {
  const columns = createMemoryUsageWarningColumn<
    MemoryUsageWarning & { no: number }
  >();

  return (
    <ReportDataTable<MemoryUsageWarning>
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
