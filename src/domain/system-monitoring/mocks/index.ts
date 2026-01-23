import type { HttpHandler } from "msw";

import { getGetNodeSystemResourceMockHandler } from "@/api/generated/admin-cluster/admin-cluster.msw";
import { systemMonitoringMetricsOverrideHandlers } from "@/domain/system-monitoring/mocks/system-monitoring-metrics.override";

/**
 * 시스템 모니터링 MSW 핸들러
 *
 * - 노드 시스템 리소스 조회 (Orval 생성)
 * - GPU 메트릭 조회 (오버라이드: yyyy-MM-dd HH:mm:ss 형식)
 * - 시스템 메트릭 조회 (오버라이드: yyyy-MM-dd HH:mm:ss 형식)
 */
export const systemMonitoringHandlers: HttpHandler[] = [
  ...systemMonitoringMetricsOverrideHandlers,
  getGetNodeSystemResourceMockHandler(),
];
