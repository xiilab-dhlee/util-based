import type { ResponsiveColumnType } from "xiilab-ui";
import { Label, type LabelColorVariant } from "xiilab-ui";

import { getHealthStatusInfo } from "@/domain/node/utils/redfish.util";

export const redfishStatusColumn: ResponsiveColumnType[] = [
  {
    title: "Status",
    dataIndex: "Status",
    align: "left",
    width: 100,
    render: (Status) => {
      const healthInfo = getHealthStatusInfo(Status.Health);
      const color = healthInfo?.color || "default";
      return (
        <span>
          <Label variant={color as LabelColorVariant} theme="light">
            {Status.Health}
          </Label>
        </span>
      );
    },
  },
];
