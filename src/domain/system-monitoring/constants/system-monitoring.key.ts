import type { GetMetricsPayload } from "@/domain/system-monitoring/types/system-monitoring.type";

export const systemMonitoringKeys = {
  default: ["systemMonitoring"],
  nodeSummary: (nodeName: string) => [
    ...systemMonitoringKeys.default,
    "nodeSummary",
    nodeName,
  ],
  resourceMetrics: (payload: GetMetricsPayload) => [
    ...systemMonitoringKeys.default,
    "resourceMetrics",
    payload.nodeName,
    payload.metricName,
    payload.startDateTime.toISOString(),
    payload.endDateTime.toISOString(),
    ...(payload.gpuName ?? []),
  ],
};
