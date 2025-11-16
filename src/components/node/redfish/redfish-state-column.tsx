import type { ResponsiveColumnType } from "xiilab-ui";

export const redfishStateColumn: ResponsiveColumnType[] = [
  {
    title: "State",
    dataIndex: "Status",
    align: "left",
    width: 100,
    render: (Status) => {
      return <span>{Status.State}</span>;
    },
  },
];
