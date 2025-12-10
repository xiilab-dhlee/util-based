import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { createNodeResourceUtilizationColumn } from "@/domain/report/columns/create-node-resource-utilization-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import type { NodeResourceUtilization as NodeResourceUtilizationType } from "@/domain/report/schemas/report.schema";

interface NodeResourceUtilizationProps {
  title: ReactNode;
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function NodeResourceUtilization({
  title,
  showToggle,
  showAll,
  onToggleShowAll,
}: NodeResourceUtilizationProps) {
  const params = useParams<{ id: string }>();
  const { data } = useGetReportDetail(params.id);

  const nodeResourceUtilization = data?.nodeResourceUtilization || [];

  const columns = createNodeResourceUtilizationColumn<
    NodeResourceUtilizationType & { no: number }
  >();

  return (
    <ReportDataTable<NodeResourceUtilizationType>
      title={title}
      columns={columns}
      data={nodeResourceUtilization}
      idField="nodeName"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
