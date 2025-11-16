import type { ColumnsType } from "antd/es/table";

export const nodeAllocatedResourcesColumn: ColumnsType<any> = [
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

