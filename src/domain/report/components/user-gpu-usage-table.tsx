import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { createUserGpuUsageColumn } from "@/domain/report/columns/create-user-gpu-usage-column";
import { ReportDataTable } from "@/domain/report/components/report-data-table";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import type { UserGpuUsage } from "@/domain/report/schemas/report.schema";

interface UserGpuUsageTableProps {
  title: ReactNode;
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function UserGpuUsageTable({
  title,
  showToggle,
  showAll,
  onToggleShowAll,
}: UserGpuUsageTableProps) {
  const params = useParams<{ id: string }>();
  const { data } = useGetReportDetail(params.id);

  const userGpuUsage = data?.userGpuUsage || [];

  const columns = createUserGpuUsageColumn<UserGpuUsage & { no: number }>();

  return (
    <ReportDataTable<UserGpuUsage>
      title={title}
      columns={columns}
      data={userGpuUsage}
      idField="userEmail"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
