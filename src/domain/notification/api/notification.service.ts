import type { GetNotificationsPayload } from "@/domain/notification/types/notification.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

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
