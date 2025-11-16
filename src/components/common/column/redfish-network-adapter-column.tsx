import type { ColumnsType } from "antd/es/table";

import redfishExpandColumn from "./redfish-expand-column";
import redfishStatusColumn from "./redfish-status-column";

export const redfishNetworkAdapterColumn: ColumnsType<any> = [
  {
    title: "Model",
    dataIndex: "Name",
    align: "left",
  },
  {
    title: "ID",
    dataIndex: "Id",
    align: "left",
  },
  {
    title: "Loaction",
    dataIndex: "UefiDevicePath",
    align: "left",
  },
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];

