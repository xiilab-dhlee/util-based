import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "@/domain/node/components/redfish/redfish-expand-column";
import { redfishStateColumn } from "@/domain/node/components/redfish/redfish-state-column";

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
