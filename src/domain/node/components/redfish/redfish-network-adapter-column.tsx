import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "@/domain/node/components/redfish/redfish-expand-column";
import { redfishStatusColumn } from "@/domain/node/components/redfish/redfish-status-column";

export const redfishNetworkAdapterColumn: ResponsiveColumnType[] = [
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
