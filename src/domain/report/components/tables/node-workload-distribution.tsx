import { useParams } from "next/navigation";
import type { ReactNode } from "react";

import { createNodeWorkloadDistributionColumn } from "@/domain/report/columns/create-node-workload-distribution-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import type { NodeWorkloadDistribution as NodeWorkloadDistributionType } from "@/domain/report/schemas/report.schema";

interface NodeWorkloadDistributionProps {
  title: ReactNode;
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function NodeWorkloadDistribution({
  title,
  showToggle,
  showAll,
  onToggleShowAll,
}: NodeWorkloadDistributionProps) {
  const params = useParams<{ id: string }>();
  const { data } = useGetReportDetail(params.id);

  const nodeDistribution = data?.nodeDistribution || [];

  const columns = createNodeWorkloadDistributionColumn<
    NodeWorkloadDistributionType & { no: number }
  >();

  return (
    <ReportDataTable<NodeWorkloadDistributionType>
      title={title}
      columns={columns}
      data={nodeDistribution}
      idField="nodeName"
      showToggle={showToggle}
      showAll={showAll}
      onToggleShowAll={onToggleShowAll}
      defaultLimit={5}
    />
  );
}
