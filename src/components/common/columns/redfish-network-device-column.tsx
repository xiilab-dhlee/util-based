import type { ColumnsType } from "antd/es/table";

import redfishExpandColumn from "./redfish-expand-column";
import redfishStateColumn from "./redfish-state-column";

export const redfishNetworkDeviceColumn: ColumnsType<any> = [
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

