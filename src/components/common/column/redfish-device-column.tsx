import type { ColumnsType } from "antd/es/table";

import redfishExpandColumn from "./redfish-expand-column";
import redfishStateColumn from "./redfish-state-column";
import redfishStatusColumn from "./redfish-status-column";

export const redfishDeviceColumn: ColumnsType<any> = [
  {
    title: "Product Name",
    dataIndex: "Name",
    align: "left",
  },
  {
    title: "State",
    dataIndex: "Status",
    align: "left",
    render: (Status: any) => {
      return <span>{Status.State}</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];

