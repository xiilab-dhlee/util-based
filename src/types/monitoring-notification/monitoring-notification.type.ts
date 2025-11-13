import type { CorePaginate, CoreSearchText } from "../common/api.interface";

/**
 * 모니터링 알림 목록 조회 payload
 */
export interface GetMonitoringNotificationsPayload
  extends CorePaginate,
    CoreSearchText {}

/**
 * 모니터링 알림 설정 목록 조회 payload
 */
export interface GetMonitoringNotificationSettingsPayload
  extends CorePaginate {}

/**
 * 모니터링 알림 상세 조회 payload
 */
export interface GetMonitoringNotificationPayload {
  /** 알림 아이디 */
  notificationId: string;
}

/**
 * 모니터링 알림 생성 payload
 */
export interface CreateMonitoringNotificationPayload {
  [key: string]: any;
}

/**
 * 모니터링 알림 수정 payload
 */
export interface UpdateMonitoringNotificationPayload {
  [key: string]: any;
}

/**
 * 모니터링 알림 생성/수정 payload
 */
export interface UpsertMonitoringNotificationPayload {
  [key: string]: any;
}
