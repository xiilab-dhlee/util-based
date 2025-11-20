import type {
  CreateMonitoringNotificationPayload,
  GetMonitoringNotificationsPayload,
  UpdateMonitoringNotificationPayload,
} from "@/domain/monitoring-notification/types/monitoring-notification.type";
import { AxiosService } from "@/shared/api/axios";
import { payloadToParams } from "@/shared/utils/service.util";

export class MonitoringService extends AxiosService {
  private readonly BASE_URL = "/monitor-api/v1/core/monitor";

  /** 모니터링 알림 목록 조회 */
  public getNotificationList(payload: GetMonitoringNotificationsPayload) {
    const params = payloadToParams(payload);

    return this.getAxios().get(`${this.BASE_URL}/notifications`, {
      params,
    });
  }

  /** 모니터링 알림 상세 조회 */
  public getNotificationDetail(id: string) {
    return this.getAxios().get(`${this.BASE_URL}/notifications/${id}`);
  }

  /** 모니터링 알림 생성 */
  public createNotification(payload: CreateMonitoringNotificationPayload) {
    return this.getAxios().post(`${this.BASE_URL}/notifications`, payload);
  }

  /** 모니터링 알림 수정 */
  public updateNotification(payload: UpdateMonitoringNotificationPayload) {
    return this.getAxios().patch(`${this.BASE_URL}/notifications`, payload);
  }
}
