import type { ColumnsType } from "antd/es/table";

import redfishStateColumn from "./redfish-state-column";
import redfishStatusColumn from "./redfish-status-column";

export const redfishThermalColumn: ColumnsType<any> = [
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
    render: (Reading: number) => {
      return <span>{Reading || 0} %</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
];

