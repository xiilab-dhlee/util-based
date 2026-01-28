import type { HttpHandler } from "msw";

import { getGetNodeSystemResourceMockHandler } from "@/api/generated/admin-cluster/admin-cluster.msw";
import { systemMonitoringMetricsOverrideHandlers } from "@/domain/system-monitoring/mocks/system-monitoring-metrics.override";

export const systemMonitoringHandlers: HttpHandler[] = [
  ...systemMonitoringMetricsOverrideHandlers,
  getGetNodeSystemResourceMockHandler(),
];
