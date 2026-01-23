import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "@/domain/node/components/redfish/redfish-expand-column";
import { redfishStateColumn } from "@/domain/node/components/redfish/redfish-state-column";
import { redfishStatusColumn } from "@/domain/node/components/redfish/redfish-status-column";

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
