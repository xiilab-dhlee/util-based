import type { ReactNode } from "react";

import { createDiskUsageWarningColumn } from "@/domain/report/columns/create-disk-usage-warning-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import type { DiskUsageWarning } from "@/domain/report/schemas/report.schema";

interface DiskUsageWarningTableProps {
  title: ReactNode;
  data: DiskUsageWarning[];
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function DiskUsageWarningTable({
  title,
  data,
  showToggle,
  showAll,
  onToggleShowAll,
}: DiskUsageWarningTableProps) {
  const columns = createDiskUsageWarningColumn<
    DiskUsageWarning & { no: number }
  >();

  return (
    <ReportDataTable<DiskUsageWarning>
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
