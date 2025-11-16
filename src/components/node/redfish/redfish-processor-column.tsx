import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "./redfish-expand-column";
import { redfishStateColumn } from "./redfish-state-column";
import { redfishStatusColumn } from "./redfish-status-column";

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
