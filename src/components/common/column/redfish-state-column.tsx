import type { ColumnsType } from "antd/es/table";

export const redfishStateColumn: ColumnsType<any> = [
  {
    title: "State",
    dataIndex: "Status",
    align: "left",
    width: 100,
    render: (Status: any) => {
      return <span>{Status.State}</span>;
    },
  },
];

