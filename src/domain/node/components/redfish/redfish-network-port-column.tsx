import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "./redfish-expand-column";

export const redfishNetworkPortColumn: ResponsiveColumnType[] = [
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
    render: (LinkStatus) => {
      return <span>{LinkStatus || "No"}</span>;
    },
  },
  {
    title: "Link Status",
    dataIndex: "LinkStatus",
    align: "left",
    render: (LinkStatus) => {
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
