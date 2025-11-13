import { AxiosService } from "@/services/common/axios";
import type { GetAlertsPayload } from "@/types/alert/alert.type";
import { payloadToParams } from "@/utils/common/service.util";

export class AlertService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/alert";

  /** 목록 조회 */
  public getList(payload: GetAlertsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}`, {
      params,
    });
  }

  /** 상세 조회 */
  public getDetail(id: string) {
    return this.getAxios().get(`${this.BASE_URL}/${id}`);
  }
}
