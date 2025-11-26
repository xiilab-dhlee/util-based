import { HttpResponse, http } from "msw";

import {
  generateMockCpuLoadAverageMetricData,
  generateMockDiskRwMetricData,
  generateMockGpuMetricData,
  generateMockMemoryDetailMetricData,
  generateMockNetworkRtMetricData,
  generateMockNodeMetricData,
  generateMockNodeSummary,
} from "@/domain/system-monitoring/mocks/system-monitoring.mock";
import type {
  ResourceMetricResponse,
  SystemResourcesSummaryResponse,
} from "@/domain/system-monitoring/types/system-monitoring.type";

/**
 * 시스템 모니터링 API 핸들러
 *
 * - MSW_ENABLE=true 인 경우에만 활성화되며,
 *   system-monitoring 서비스에서 호출하는 엔드포인트를 모킹한다.
 */
export const systemMonitoringHandlers = [
  // 노드 요약 정보 조회 (GPU 목록 포함)
  http.get<{ nodeName: string }, never, SystemResourcesSummaryResponse>(
    "/api/v1/cluster/nodes/:nodeName/system-resources/summary",
    ({ params }) => {
      const nodeName = params.nodeName;

      const data = generateMockNodeSummary(nodeName);

      return HttpResponse.json<SystemResourcesSummaryResponse>(data);
    },
  ),

  // 메트릭 시계열 데이터 조회
  http.get<{ nodeName: string }, never, ResourceMetricResponse[]>(
    "/api/v1/cluster/nodes/:nodeName/resources/metrics",
    ({ params, request }) => {
      const nodeName = params.nodeName;

      const url = new URL(request.url);
      const metricName = url.searchParams.get("metricName") ?? "";

      // GPU 필터는 ?gpuName=a,b 형태의 콤마 구분 문자열로 전달
      const gpuNameParam = url.searchParams.get("gpuName");
      const gpuNames =
        gpuNameParam && gpuNameParam.length > 0
          ? gpuNameParam
              .split(",")
              .map((name) => name.trim())
              .filter(Boolean)
          : undefined;

      // GPU 메트릭 여부 판단 로직은 서비스와 동일하게 유지
      const isGpuMetric = metricName.startsWith("gpu-");

      let data: ResourceMetricResponse[];

      if (isGpuMetric) {
        // GPU 메트릭: GPU별로 데이터 생성
        const nodeSummary = generateMockNodeSummary(nodeName);
        const gpuNamesToUse =
          gpuNames && gpuNames.length > 0 ? gpuNames : nodeSummary.gpuName;
        data = generateMockGpuMetricData(gpuNamesToUse, nodeName);
      } else {
        // GPU 이외 메트릭 (CPU, Memory, Network, Disk)
        switch (metricName) {
          case "network-rt":
            data = generateMockNetworkRtMetricData(nodeName);
            break;
          case "disk-rw":
            data = generateMockDiskRwMetricData(nodeName);
            break;
          case "memory-detail":
            data = generateMockMemoryDetailMetricData(nodeName);
            break;
          case "cpu-load-average":
            data = generateMockCpuLoadAverageMetricData(nodeName);
            break;
          default:
            // CPU, memory-utilization, disk-utilization 등 단일 메트릭
            data = generateMockNodeMetricData(nodeName);
        }
      }

      return HttpResponse.json<ResourceMetricResponse[]>(data);
    },
  ),
];
