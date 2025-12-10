import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { createCpuUsageWarningColumn } from "@/domain/report/columns/create-cpu-usage-warning-column";
import { ReportDataTable } from "@/domain/report/components/report-data-table";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import type { CpuUsageWarning } from "@/domain/report/schemas/report.schema";

interface CpuUsageWarningTableProps {
  title: ReactNode;
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function CpuUsageWarningTable({
  title,
  showToggle,
  showAll,
  onToggleShowAll,
}: CpuUsageWarningTableProps) {
  const params = useParams<{ id: string }>();
  const { data } = useGetReportDetail(params.id);

  const cpuUsageWarning = data?.cpuUsageWarning || [];

  const columns = createCpuUsageWarningColumn<
    CpuUsageWarning & { no: number }
  >();

  return (
    <ReportDataTable<CpuUsageWarning>
      title={title}
      columns={columns}
      data={cpuUsageWarning}
      idField="gpuIndex"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
