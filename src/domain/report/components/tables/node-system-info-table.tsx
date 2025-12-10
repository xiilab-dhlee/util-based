import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { createNodeSystemInfoColumn } from "@/domain/report/columns/create-node-system-info-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import type { NodeSystemInfo } from "@/domain/report/schemas/report.schema";

interface NodeSystemInfoTableProps {
  title: ReactNode;
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function NodeSystemInfoTable({
  title,
  showToggle,
  showAll,
  onToggleShowAll,
}: NodeSystemInfoTableProps) {
  const params = useParams<{ id: string }>();
  const { data } = useGetReportDetail(params.id);

  const nodeSystemInfo = data?.nodeSystemInfo || [];

  const columns = createNodeSystemInfoColumn<NodeSystemInfo & { no: number }>();

  return (
    <ReportDataTable<NodeSystemInfo>
      title={title}
      columns={columns}
      data={nodeSystemInfo}
      idField="nodeName"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
