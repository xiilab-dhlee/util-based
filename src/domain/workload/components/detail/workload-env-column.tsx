import type { ResponsiveColumnType } from "xiilab-ui";

import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";

export const workloadEnvColumn: ResponsiveColumnType[] = [
  {
    title: "키",
    dataIndex: "envKey",
    align: "left",
    render: (envKey: string) => {
      return <span data-testid={WORKLOAD_SELECTOR.ENV_KEY}>{envKey}</span>;
    },
  },

  {
    title: "값",
    dataIndex: "envValue",
    align: "left",
    render: (envValue: string) => {
      return <span data-testid={WORKLOAD_SELECTOR.ENV_VALUE}>{envValue}</span>;
    },
  },
];
