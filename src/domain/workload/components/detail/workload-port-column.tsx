import type { ResponsiveColumnType } from "xiilab-ui";

export const workloadPortColumn: ResponsiveColumnType[] = [
  {
    key: "portName",
    title: "포트 이름",
    dataIndex: "portName",
    align: "left",
    width: "auto",
    cellPadding: "0 12px",
  },
  {
    key: "port",
    title: "포트 번호",
    dataIndex: "port",
    align: "left",
    width: "auto",
    cellPadding: "0 12px",
  },
  {
    key: "url",
    title: "접속",
    dataIndex: "url",
    align: "left",
    width: "auto",
    cellPadding: "0 12px",
  },
];
