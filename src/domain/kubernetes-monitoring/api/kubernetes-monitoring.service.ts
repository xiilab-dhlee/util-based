import type { KubernetesResourceName } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import type { KubernetesResourceListResponse } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { AxiosService } from "@/shared/api/axios";
import type { CorePayload } from "@/shared/types/api.interface";
import { payloadToParams } from "@/shared/utils/service.util";

export interface GetKubernetesResourceListPayload extends CorePayload {
  pageNo: number;
  pageSize: number;
  keyword?: string;
  status?: string;
}

export class KubernetesMonitoringService extends AxiosService {
  private readonly BASE_URL = "/api/v1/k8s/resources";

  /**
   * k8s 특정 리소스 목록 조회
   *
   * GET /api/v1/k8s/resources/{resourceName}
   * query: pageNo, pageSize, keyword, status
   */
  public async getKubernetesResourceList(
    resourceName: KubernetesResourceName,
    payload: GetKubernetesResourceListPayload,
  ): Promise<{ data: KubernetesResourceListResponse }> {
    const params = payloadToParams(payload);

    return this.getAxios().get<KubernetesResourceListResponse>(
      `${this.BASE_URL}/${resourceName}`,
      {
        params,
      },
    );
  }
}

export const kubernetesMonitoringService = new KubernetesMonitoringService();
