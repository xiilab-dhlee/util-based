import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "./redfish-expand-column";
import { redfishStateColumn } from "./redfish-state-column";
import { redfishStatusColumn } from "./redfish-status-column";

export const redfishChassisColumn: ResponsiveColumnType[] = [
  {
    title: "Model",
    dataIndex: "Model",
    align: "left",
  },
  {
    title: "Serial number",
    dataIndex: "SerialNumber",
    align: "left",
  },
  {
    title: "Type",
    dataIndex: "ChassisType",
    align: "left",
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];
