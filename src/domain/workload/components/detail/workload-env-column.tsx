import type { ResponsiveColumnType } from "xiilab-ui";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

export const workloadEnvColumn: ResponsiveColumnType[] = [
  {
    title: "키",
    dataIndex: "key",
    align: "left",
    width: "50%",
    render: (key: string) => {
      return <span data-testid={WORKLOAD_SELECTOR.ENV_KEY}>{key}</span>;
    },
  },
  {
    title: "값",
    dataIndex: "value",
    align: "left",
    width: "50%",
    render: (value: string) => {
      return <span data-testid={WORKLOAD_SELECTOR.ENV_VALUE}>{value}</span>;
    },
  },
];
