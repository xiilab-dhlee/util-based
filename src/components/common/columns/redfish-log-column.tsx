import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { Label } from "xiilab-ui";

import { getHealthStatusInfo } from "@/utils/node/redfish.util";
import redfishExpandColumn from "./redfish-expand-column";

export const redfishLogColumn: ColumnsType<any> = [
  {
    title: "Status",
    dataIndex: "Severity",
    align: "left",
    width: 100,
    render: (Severity: any) => {
      const healthInfo = getHealthStatusInfo(Severity);
      const color = healthInfo?.color || "default";
      return (
        <span>
          <Label variant={color} theme="light">
            {Severity}
          </Label>
        </span>
      );
    },
  },
  {
    title: "Message",
    dataIndex: "Message",
    align: "left",
  },
  {
    title: "Date",
    dataIndex: "Created",
    align: "left",
    render: (Created: any) => {
      return <span>{format(Created, "MM/dd/yyyy HH:mm:ss ")}</span>;
    },
  },
  {
    title: "Owner",
    dataIndex: "Oem",
    align: "center",
    render: (Oem: any) => {
      return <span>{Oem?.Hpe?.Categories.join(", ")}</span>;
    },
  },
  ...redfishExpandColumn,
];

