import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishStateColumn } from "@/domain/node/components/redfish/redfish-state-column";
import { redfishStatusColumn } from "@/domain/node/components/redfish/redfish-status-column";

export const redfishThermalColumn: ResponsiveColumnType[] = [
  {
    title: "Location",
    dataIndex: "Location",
    align: "left",
  },
  {
    title: "Name",
    dataIndex: "Name",
    align: "left",
  },
  {
    title: "Speed",
    dataIndex: "Reading",
    align: "center",
    render: (Reading) => {
      return <span>{Reading || 0} %</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
];
