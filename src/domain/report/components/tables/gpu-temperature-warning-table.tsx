import type { ReactNode } from "react";

import { createGpuTemperatureWarningColumn } from "@/domain/report/columns/create-gpu-temperature-warning-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import type { GpuTemperatureWarning } from "@/domain/report/schemas/report.schema";

interface GpuTemperatureWarningTableProps {
  title: ReactNode;
  data: GpuTemperatureWarning[];
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function GpuTemperatureWarningTable({
  title,
  data,
  showToggle,
  showAll,
  onToggleShowAll,
}: GpuTemperatureWarningTableProps) {
  const columns = createGpuTemperatureWarningColumn<
    GpuTemperatureWarning & { no: number }
  >();

  return (
    <ReportDataTable<GpuTemperatureWarning>
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
