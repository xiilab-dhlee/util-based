import type { ResponsiveColumnType } from "xiilab-ui";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

export const workloadEnvColumn: ResponsiveColumnType[] = [
  {
    title: "키",
    dataIndex: "envKey",
    align: "left",
    width: "50%",
    render: (envKey: string) => {
      return <span data-testid={WORKLOAD_SELECTOR.ENV_KEY}>{envKey}</span>;
    },
  },

  {
    title: "값",
    dataIndex: "envValue",
    align: "left",
    width: "50%",
    render: (envValue: string) => {
      return <span data-testid={WORKLOAD_SELECTOR.ENV_VALUE}>{envValue}</span>;
    },
  },
];
