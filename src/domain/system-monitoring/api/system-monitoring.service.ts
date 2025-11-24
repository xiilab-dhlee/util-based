import type {
  GetMetricsPayload,
  ResourceMetricResponse,
  SystemResourcesSummaryResponse,
} from "@/domain/system-monitoring/types/system-monitoring.type";
import { AxiosService } from "@/shared/api/axios";

/**
 * 시스템 모니터링 API 서비스
 */
export class SystemMonitoringService extends AxiosService {
  private readonly BASE_URL = "/api/v1/cluster/nodes";

  /**
   * 노드 요약 정보 조회 (GPU 목록 포함)
   * GET /api/v1/cluster/nodes/{nodeName}/system-resources/summary
   */
  public async getSystemResourcesSummary(
    nodeName: string,
  ): Promise<{ data: SystemResourcesSummaryResponse }> {
    return this.getAxios().get<SystemResourcesSummaryResponse>(
      `${this.BASE_URL}/${nodeName}/system-resources/summary`,
    );
  }

  /**
   * 메트릭 시계열 데이터 조회
   * GET /api/v1/cluster/nodes/{nodeName}/resources/metrics
   *
   * @param payload - 조회 조건 (노드명, 메트릭 타입, 기간, GPU 필터)
   */
  public async getResourceMetrics(
    payload: GetMetricsPayload,
  ): Promise<{ data: ResourceMetricResponse[] }> {
    const searchParams = new URLSearchParams();

    searchParams.set("metricName", payload.metricName);
    searchParams.set("startDateTime", payload.startDateTime.toISOString());
    searchParams.set("endDateTime", payload.endDateTime.toISOString());

    /**
     * GPU 필터가 있는 경우, ?gpuName=a,b 형태의 콤마 구분 문자열로 전달
     */
    if (payload.gpuName && payload.gpuName.length > 0) {
      const joinedGpuNames = payload.gpuName.join(",");
      searchParams.set("gpuName", joinedGpuNames);
    }

    const url = `${this.BASE_URL}/${payload.nodeName}/resources/metrics?${searchParams.toString()}`;

    return this.getAxios().get<ResourceMetricResponse[]>(url);
  }
}

// 싱글톤 인스턴스 export
export const systemMonitoringService = new SystemMonitoringService();
