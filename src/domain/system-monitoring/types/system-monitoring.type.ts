import type { TabsSeparatedItem } from "xiilab-ui";

export type SystemMonitoringTabKey = "gpu" | "system";
export type SystemMonitoringTabItem = Omit<TabsSeparatedItem, "key"> & {
  key: SystemMonitoringTabKey;
};
