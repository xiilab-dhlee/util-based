import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "@/domain/node/components/redfish/redfish-expand-column";

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
