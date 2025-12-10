import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { createMemoryUsageWarningColumn } from "@/domain/report/columns/create-memory-usage-warning-column";
import { ReportDataTable } from "@/domain/report/components/report-data-table";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import type { MemoryUsageWarning } from "@/domain/report/schemas/report.schema";

interface MemoryUsageWarningTableProps {
  title: ReactNode;
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function MemoryUsageWarningTable({
  title,
  showToggle,
  showAll,
  onToggleShowAll,
}: MemoryUsageWarningTableProps) {
  const params = useParams<{ id: string }>();
  const { data } = useGetReportDetail(params.id);

  const memoryUsageWarning = data?.memoryUsageWarning || [];

  const columns = createMemoryUsageWarningColumn<
    MemoryUsageWarning & { no: number }
  >();

  return (
    <ReportDataTable<MemoryUsageWarning>
      title={title}
      columns={columns}
      data={memoryUsageWarning}
      idField="gpuIndex"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
