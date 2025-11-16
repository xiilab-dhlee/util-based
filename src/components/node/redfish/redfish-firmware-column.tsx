import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "./redfish-expand-column";

export const redfishFirmwareColumn: ResponsiveColumnType[] = [
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
