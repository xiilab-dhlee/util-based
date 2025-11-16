import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "./redfish-expand-column";
import { redfishStateColumn } from "./redfish-state-column";
import { redfishStatusColumn } from "./redfish-status-column";

export const redfishPowerSupplyColumn: ResponsiveColumnType[] = [
  {
    title: "Name",
    dataIndex: "Name",
    align: "left",
  },
  {
    title: "Model",
    dataIndex: "Model",
    align: "left",
  },
  {
    title: "Type",
    dataIndex: "PowerSupplyType",
    align: "left",
  },
  {
    title: "Power Capacity",
    dataIndex: "PowerCapacityWattsy",
    align: "left",
    width: 100,
    render: (PowerCapacityWattsy) => {
      return <span>{PowerCapacityWattsy || 0} watts</span>;
    },
  },
  {
    title: "Average Power Output",
    dataIndex: "AveragePowerOutputWatts",
    align: "left",
    render: (AveragePowerOutputWatts) => {
      return <span>{AveragePowerOutputWatts || 0} watts</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];
