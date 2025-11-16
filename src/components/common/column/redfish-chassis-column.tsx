import type { ColumnsType } from "antd/es/table";

import redfishExpandColumn from "./redfish-expand-column";
import redfishStateColumn from "./redfish-state-column";
import redfishStatusColumn from "./redfish-status-column";

export const redfishChassisColumn: ColumnsType<any> = [
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

