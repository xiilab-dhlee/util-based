import type { ReactNode } from "react";

import { createNodeResourceUtilizationColumn } from "@/domain/report/columns/create-node-resource-utilization-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import type { NodeResourceUtilization as NodeResourceUtilizationType } from "@/domain/report/schemas/report.schema";

interface NodeResourceUtilizationProps {
  title: ReactNode;
  data: NodeResourceUtilizationType[];
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function NodeResourceUtilization({
  title,
  data,
  showToggle,
  showAll,
  onToggleShowAll,
}: NodeResourceUtilizationProps) {
  const columns = createNodeResourceUtilizationColumn<
    NodeResourceUtilizationType & { no: number }
  >();

  return (
    <ReportDataTable<NodeResourceUtilizationType>
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
