import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "./redfish-expand-column";
import { redfishStateColumn } from "./redfish-state-column";
import { redfishStatusColumn } from "./redfish-status-column";

export const redfishDeviceColumn: ResponsiveColumnType[] = [
  {
    title: "Product Name",
    dataIndex: "Name",
    align: "left",
  },
  {
    title: "State",
    dataIndex: "Status",
    align: "left",
    render: (Status) => {
      return <span>{Status.State}</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];
