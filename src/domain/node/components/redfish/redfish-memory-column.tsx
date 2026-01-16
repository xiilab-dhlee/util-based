import type { ResponsiveColumnType } from "xiilab-ui";

import { redfishExpandColumn } from "@/domain/node/components/redfish/redfish-expand-column";
import { redfishStateColumn } from "@/domain/node/components/redfish/redfish-state-column";
import { redfishStatusColumn } from "@/domain/node/components/redfish/redfish-status-column";

export const redfishMemoryColumn: ResponsiveColumnType[] = [
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
    render: (CapacityMiB) => {
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
    render: (OperatingSpeedMhz) => {
      return <span>{OperatingSpeedMhz || 0} MHz</span>;
    },
  },
  ...redfishStateColumn,
  ...redfishStatusColumn,
  ...redfishExpandColumn,
];
