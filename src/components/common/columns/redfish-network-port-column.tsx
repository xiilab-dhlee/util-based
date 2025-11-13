import type { ColumnsType } from "antd/es/table";

import redfishExpandColumn from "./redfish-expand-column";

export const redfishNetworkPortColumn: ColumnsType<any> = [
  {
    title: "ID",
    dataIndex: "Id",
    align: "left",
  },
  {
    title: "Address",
    dataIndex: "MACAddress",
    align: "left",
  },
  {
    title: "Signal Detected",
    dataIndex: "LinkStatus",
    align: "left",
    render: (LinkStatus: string) => {
      return <span>{LinkStatus || "No"}</span>;
    },
  },
  {
    title: "Link Status",
    dataIndex: "LinkStatus",
    align: "left",
    render: (LinkStatus: string) => {
      return <span>{LinkStatus || "No"}</span>;
    },
  },
  {
    title: "Current Speed",
    dataIndex: "SpeedMbps",
    align: "left",
  },
  ...redfishExpandColumn,
];

