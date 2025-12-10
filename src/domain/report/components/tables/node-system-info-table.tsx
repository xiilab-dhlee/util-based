import type { ReactNode } from "react";

import { createNodeSystemInfoColumn } from "@/domain/report/columns/create-node-system-info-column";
import { ReportDataTable } from "@/domain/report/components/tables/report-data-table";
import type { NodeSystemInfo } from "@/domain/report/schemas/report.schema";

interface NodeSystemInfoTableProps {
  title: ReactNode;
  data: NodeSystemInfo[];
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
}

export function NodeSystemInfoTable({
  title,
  data,
  showToggle,
  showAll,
  onToggleShowAll,
}: NodeSystemInfoTableProps) {
  const columns = createNodeSystemInfoColumn<NodeSystemInfo & { no: number }>();

  return (
    <ReportDataTable<NodeSystemInfo>
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
