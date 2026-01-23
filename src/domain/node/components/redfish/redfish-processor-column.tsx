import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "@/domain/node/components/redfish/redfish-expand-column";
import { redfishStateColumn } from "@/domain/node/components/redfish/redfish-state-column";
import { redfishStatusColumn } from "@/domain/node/components/redfish/redfish-status-column";

export const redfishProcessorColumn: ResponsiveColumnType[] = [
  {
    title: "Socket",
    dataIndex: "Socket",
    align: "left",
  },
  {
    title: "Model",
    dataIndex: "Model",
    align: "left",
  },
  {
    title: "Cores",
    dataIndex: "TotalCores",
    align: "center",
  },
  {
    title: "Threads",
    dataIndex: "TotalThreads",
    align: "center",
  },
  {
    title: "Max Speed",
    dataIndex: "MaxSpeedMHz",
    align: "left",
    render: (MaxSpeedMHz) => {
      return <span>{MaxSpeedMHz || 0} MHz</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];
