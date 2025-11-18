import type { ResponsiveColumnType } from "xiilab-ui";

export const nodeAllocatedResourcesColumn: ResponsiveColumnType[] = [
  {
    title: "Resource",
    dataIndex: "resourceName",
    align: "left",
  },
  {
    title: "Requests",
    dataIndex: "requests",
    align: "left",
  },
  {
    title: "Limits",
    dataIndex: "limits",
    align: "left",
  },
];
