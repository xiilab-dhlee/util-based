import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { createDiskUsageWarningColumn } from "@/domain/report/columns/create-disk-usage-warning-column";
import { ReportDataTable } from "@/domain/report/components/report-data-table";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import type { DiskUsageWarning } from "@/domain/report/schemas/report.schema";

interface DiskUsageWarningTableProps {
  title: ReactNode;
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function DiskUsageWarningTable({
  title,
  showToggle,
  showAll,
  onToggleShowAll,
}: DiskUsageWarningTableProps) {
  const params = useParams<{ id: string }>();
  const { data } = useGetReportDetail(params.id);

  const diskUsageWarning = data?.diskUsageWarning || [];

  const columns = createDiskUsageWarningColumn<
    DiskUsageWarning & { no: number }
  >();

  return (
    <ReportDataTable<DiskUsageWarning>
      title={title}
      columns={columns}
      data={diskUsageWarning}
      idField="gpuIndex"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
