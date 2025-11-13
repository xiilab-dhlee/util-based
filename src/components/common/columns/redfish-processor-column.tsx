import type { ColumnsType } from "antd/es/table";

import redfishExpandColumn from "./redfish-expand-column";
import redfishStateColumn from "./redfish-state-column";
import redfishStatusColumn from "./redfish-status-column";

export const redfishProcessorColumn: ColumnsType<any> = [
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
    render: (MaxSpeedMHz: number) => {
      return <span>{MaxSpeedMHz || 0} MHz</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];

