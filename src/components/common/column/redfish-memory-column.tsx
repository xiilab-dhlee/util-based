import type { ColumnsType } from "antd/es/table";

import redfishExpandColumn from "./redfish-expand-column";
import redfishStateColumn from "./redfish-state-column";
import redfishStatusColumn from "./redfish-status-column";

export const redfishMemoryColumn: ColumnsType<any> = [
  {
    title: "Memory Type",
    dataIndex: "MemoryType",
    align: "left",
  },
  {
    title: "Loaction",
    dataIndex: "DeviceLocator",
    align: "left",
  },
  {
    title: "Base Device Type",
    dataIndex: "MemoryDeviceType",
    align: "left",
  },
  {
    title: "Capacity",
    dataIndex: "CapacityMiB",
    align: "left",
    render: (CapacityMiB: number) => {
      let capacity = "0";
      if (CapacityMiB > 0) {
        capacity = `${(CapacityMiB / 1024).toFixed(1)}`;
      }

      return <span>{capacity} GiB</span>;
    },
  },
  {
    title: "Operating Frequency",
    dataIndex: "OperatingSpeedMhz",
    align: "left",
    render: (OperatingSpeedMhz: number) => {
      return <span>{OperatingSpeedMhz || 0} MHz</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];

