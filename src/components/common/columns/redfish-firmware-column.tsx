import type { ColumnsType } from "antd/es/table";

import redfishExpandColumn from "./redfish-expand-column";

export const redfishFirmwareColumn: ColumnsType<any> = [
  {
    title: "Name",
    dataIndex: "Name",
    align: "left",
  },
  {
    title: "Version",
    dataIndex: "Version",
    align: "left",
  },
  ...redfishExpandColumn,
];

