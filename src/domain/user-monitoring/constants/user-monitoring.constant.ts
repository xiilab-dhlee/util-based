import type { DropdownOption } from "xiilab-ui";

import type { CoreChartSeries } from "@/shared/types/core.model";

export const USER_MONITORING_RESOURCE_OPTIONS: DropdownOption[] = [
  {
    label: "GPU",
    value: "GPU",
  },
  {
    label: "CPU",
    value: "CPU",
  },
  {
    label: "MEM",
    value: "MEM",
  },
];

export const USER_MONITORING_SERIES_DEMO: Record<
  string,
  {
    unit: string;
    series: CoreChartSeries[];
  }
> = {
  GPU: {
    unit: "개",
    series: [
      {
        type: "area",
        name: "GPU",
        data: [
          [Date.now() - 24 * 60 * 60 * 1000, 2],
          [Date.now() - 18 * 60 * 60 * 1000, 7],
          [Date.now() - 12 * 60 * 60 * 1000, 9],
          [Date.now() - 6 * 60 * 60 * 1000, 5],
          [Date.now() - 0 * 60 * 60 * 1000, 3],
        ],
      },
    ],
  },
  CPU: {
    unit: "Core",
    series: [
      {
        type: "area",
        name: "CPU",
        data: [
          [Date.now() - 24 * 60 * 60 * 1000, 7],
          [Date.now() - 18 * 60 * 60 * 1000, 3],
          [Date.now() - 12 * 60 * 60 * 1000, 2],
          [Date.now() - 6 * 60 * 60 * 1000, 6],
          [Date.now() - 0 * 60 * 60 * 1000, 3],
        ],
      },
    ],
  },
  MEM: {
    unit: "GB",
    series: [
      {
        type: "area",
        name: "MEM",
        data: [
          [Date.now() - 24 * 60 * 60 * 1000, 0],
          [Date.now() - 18 * 60 * 60 * 1000, 6],
          [Date.now() - 12 * 60 * 60 * 1000, 6],
          [Date.now() - 6 * 60 * 60 * 1000, 6],
          [Date.now() - 0 * 60 * 60 * 1000, 0],
        ],
      },
    ],
  },
};
