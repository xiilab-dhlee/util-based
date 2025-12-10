import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { createGpuTemperatureWarningColumn } from "@/domain/report/columns/create-gpu-temperature-warning-column";
import { ReportDataTable } from "@/domain/report/components/report-data-table";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import type { GpuTemperatureWarning } from "@/domain/report/schemas/report.schema";

interface GpuTemperatureWarningTableProps {
  title: ReactNode;
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function GpuTemperatureWarningTable({
  title,
  showToggle,
  showAll,
  onToggleShowAll,
}: GpuTemperatureWarningTableProps) {
  const params = useParams<{ id: string }>();
  const { data } = useGetReportDetail(params.id);

  const gpuTemperatureWarning = data?.gpuTemperatureWarning || [];

  const columns = createGpuTemperatureWarningColumn<
    GpuTemperatureWarning & { no: number }
  >();

  return (
    <ReportDataTable<GpuTemperatureWarning>
      title={title}
      columns={columns}
      data={gpuTemperatureWarning}
      idField="gpuIndex"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
