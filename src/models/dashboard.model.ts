import type { MySelectOption } from "@/components/common/select";
import type { CoreChartSeries } from "@/types/common/core.model";

export function Dashboard() {}

Dashboard.RESOURCE_OPTIONS = [
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
] as MySelectOption[];

Dashboard.DEMO_GPU_SERIES = {
  name: "GPU",
  data: [
    [Date.now() - 24 * 60 * 60 * 1000, 2],
    [Date.now() - 18 * 60 * 60 * 1000, 7],
    [Date.now() - 12 * 60 * 60 * 1000, 9],
    [Date.now() - 6 * 60 * 60 * 1000, 5],
    [Date.now() - 0 * 60 * 60 * 1000, 3],
  ],
} as CoreChartSeries;

Dashboard.DEMO_CPU_SERIES = {
  name: "CPU",
  data: [
    [Date.now() - 24 * 60 * 60 * 1000, 7],
    [Date.now() - 18 * 60 * 60 * 1000, 3],
    [Date.now() - 12 * 60 * 60 * 1000, 2],
    [Date.now() - 6 * 60 * 60 * 1000, 6],
    [Date.now() - 0 * 60 * 60 * 1000, 3],
  ],
} as CoreChartSeries;

Dashboard.DEMO_MEM_SERIES = {
  name: "MEM",
  data: [
    [Date.now() - 24 * 60 * 60 * 1000, 0],
    [Date.now() - 18 * 60 * 60 * 1000, 6],
    [Date.now() - 12 * 60 * 60 * 1000, 6],
    [Date.now() - 6 * 60 * 60 * 1000, 6],
    [Date.now() - 0 * 60 * 60 * 1000, 0],
  ],
} as CoreChartSeries;
// ------------------------------------
// 정적(Static) 메소드
// ------------------------------------

Dashboard.getFirstResourceOption = (): MySelectOption => {
  return Dashboard.RESOURCE_OPTIONS[0];
};

Dashboard.getGraphSeries = (resource: string | null): CoreChartSeries => {
  if (resource === "CPU") {
    return Dashboard.DEMO_CPU_SERIES;
  } else if (resource === "MEM") {
    return Dashboard.DEMO_MEM_SERIES;
  }

  return Dashboard.DEMO_GPU_SERIES;
};
