import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";
import { Label, type LabelColorVariant } from "xiilab-ui";

import { getHealthStatusInfo } from "@/domain/node/utils/redfish.util";
import { redfishExpandColumn } from "./redfish-expand-column";

export const redfishLogColumn: ResponsiveColumnType[] = [
  {
    title: "Status",
    dataIndex: "Severity",
    align: "left",
    width: 100,
    render: (Severity) => {
      const healthInfo = getHealthStatusInfo(Severity);
      const color = healthInfo?.color || "default";
      return (
        <span>
          <Label variant={color as LabelColorVariant} theme="light">
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
    render: (Created) => {
      return <span>{format(Created, "MM/dd/yyyy HH:mm:ss ")}</span>;
    },
  },
  {
    title: "Owner",
    dataIndex: "Oem",
    align: "center",
    render: (Oem) => {
      return <span>{Oem?.Hpe?.Categories.join(", ")}</span>;
    },
  },
  ...redfishExpandColumn,
];
