"use client";

import { CustomizedTable } from "@/components/common/table/customized-table";
import clusterMonitoringConstants from "@/constants/monitoring/cluster-monitoring.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { clusterResourceListColumn } from "./cluster-resource-list-column";

export function ClusterResourceListBody() {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={clusterResourceListColumn}
        data={Array.from({
          length: clusterMonitoringConstants.resourcePageSize,
        }).map((_, index) => ({
          id: index + 1,
          name: "master-x3250m5-" + (index + 1),
          namespace: "Pod Container" + (index + 1),
          status: index % 2 === 0 ? "Running" : "Pending",
          creatorDate: new Date().toISOString(),
        }))}
        activePadding
      />
    </ListWrapper>
  );
}
