import type { ResponsiveColumnType } from "xiilab-ui";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

export const workloadPortColumn: ResponsiveColumnType[] = [
  {
    title: "포트 이름",
    dataIndex: "portName",
    align: "left",
    width: "20%",
    ellipsis: true,
    render: (portName: string) => {
      return (
        <span data-testid={WORKLOAD_SELECTOR.PORT_NAME}>{portName ?? "-"}</span>
      );
    },
  },
  {
    title: "포트 번호",
    dataIndex: "portNumber",
    align: "left",
    width: "15%",
    render: (portNumber: number) => {
      return (
        <span data-testid={WORKLOAD_SELECTOR.PORT_VALUE}>
          {portNumber ?? "-"}
        </span>
      );
    },
  },
  {
    title: "서비스 포트 번호",
    dataIndex: "servicePortNum",
    align: "left",
    width: "20%",
    render: (servicePortNum: number) => {
      return <span>{servicePortNum ?? "-"}</span>;
    },
  },
  {
    title: "접속",
    dataIndex: "url",
    align: "left",
    width: "45%",
    render: (url: string) => {
      if (!url) {
        return <span data-testid={WORKLOAD_SELECTOR.PORT_URL}>-</span>;
      }
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={WORKLOAD_SELECTOR.PORT_URL}
        >
          {url}
        </a>
      );
    },
  },
];
