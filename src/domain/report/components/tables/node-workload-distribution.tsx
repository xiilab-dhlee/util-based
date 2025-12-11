import type { ReactNode } from "react";

import { createNodeWorkloadDistributionColumn } from "@/domain/report/columns/create-node-workload-distribution-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import type { NodeWorkloadDistribution as NodeWorkloadDistributionType } from "@/domain/report/schemas/report.schema";

interface NodeWorkloadDistributionProps {
  title: ReactNode;
  data: NodeWorkloadDistributionType[];
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function NodeWorkloadDistribution({
  title,
  data,
  showToggle,
  showAll,
  onToggleShowAll,
}: NodeWorkloadDistributionProps) {
  const columns = createNodeWorkloadDistributionColumn<
    NodeWorkloadDistributionType & { no: number }
  >();

  return (
    <ReportDataTable<NodeWorkloadDistributionType>
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
