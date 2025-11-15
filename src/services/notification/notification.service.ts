import { AxiosService } from "@/services/common/axios";
import type { GetNotificationsPayload } from "@/types/notification/notification.type";
import { payloadToParams } from "@/utils/common/service.util";

export class NotificationService extends AxiosService {
  private readonly BASE_URL = "/core-api/v1/core/notification";

  /** 목록 조회 */
  public getList(payload: GetNotificationsPayload) {
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

