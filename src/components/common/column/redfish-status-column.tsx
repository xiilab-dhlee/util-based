import type { ColumnsType } from "antd/es/table";
import { Label } from "xiilab-ui";

import { getHealthStatusInfo } from "@/utils/node/redfish.util";

export const redfishStatusColumn: ColumnsType<any> = [
  {
    title: "Status",
    dataIndex: "Status",
    align: "left",
    width: 100,
    render: (Status: any) => {
      const healthInfo = getHealthStatusInfo(Status.Health);
      const color = healthInfo?.color || "default";
      return (
        <span>
          <Label variant={color} theme="light">
            {Status.Health}
          </Label>
        </span>
      );
    },
  },
];

