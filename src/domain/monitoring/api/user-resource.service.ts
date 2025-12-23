import type { GetUserResourcesPayload } from "@/domain/monitoring/types/monitoring.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class UserResourceService extends AxiosService {
  private readonly BASE_URL = "/monitor-api/v1/core/monitor";

  /** 사용자별 리소스 점유율 목록 조회 */
  public getUserResources(payload: GetUserResourcesPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/user-resources`, {
      params,
    });
  }
}
