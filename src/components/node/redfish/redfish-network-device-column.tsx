import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "./redfish-expand-column";
import { redfishStateColumn } from "./redfish-state-column";

export const redfishNetworkDeviceColumn: ResponsiveColumnType[] = [
  {
    title: "ID",
    dataIndex: "Id",
    align: "left",
  },
  ...redfishStateColumn,
  {
    title: "MAC Address",
    dataIndex: "MACAddress",
    align: "left",
  },
  ...redfishExpandColumn,
];
