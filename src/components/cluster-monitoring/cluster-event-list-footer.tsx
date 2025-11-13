"use client";

import clusterMonitoringConstants from "@/constants/monitoring/cluster-monitoring.constant";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

export function ClusterEventListFooter() {
  return (
    <ListPageFooter
      total={100}
      page={1}
      pageSize={clusterMonitoringConstants.eventPageSize}
      onChange={() => {}}
      isLoading={false}
    />
  );
}

