import type { ResponsiveColumnType } from "xiilab-ui";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

export const workloadPortColumn: ResponsiveColumnType[] = [
  {
    title: "포트 이름",
    dataIndex: "portName",
    align: "left",
    render: (portName: string) => {
      return (
        <span data-testid={WORKLOAD_SELECTOR.portName(portName)}>
          {portName}
        </span>
      );
    },
  },
  {
    title: "포트 번호",
    dataIndex: "port",
    align: "left",
    render: (port: string) => {
      return <span data-testid={WORKLOAD_SELECTOR.port(port)}>{port}</span>;
    },
  },
  {
    title: "접속",
    dataIndex: "url",
    align: "left",
    render: (url: string) => {
      return <span data-testid={WORKLOAD_SELECTOR.portUrl(url)}>{url}</span>;
    },
  },
];
