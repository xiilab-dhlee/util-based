import type { ColumnsType } from "antd/es/table";

import redfishExpandColumn from "./redfish-expand-column";
import redfishStateColumn from "./redfish-state-column";
import redfishStatusColumn from "./redfish-status-column";

export const redfishPowerSupplyColumn: ColumnsType<any> = [
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
    render: (PowerCapacityWattsy: number) => {
      return <span>{PowerCapacityWattsy || 0} watts</span>;
    },
  },
  {
    title: "Average Power Output",
    dataIndex: "AveragePowerOutputWatts",
    align: "left",
    render: (AveragePowerOutputWatts: number) => {
      return <span>{AveragePowerOutputWatts || 0} watts</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];

