import type {
  CorePaginate,
  CorePayload,
  CoreSearchText,
} from "@/shared/types/api.interface";

/**
 * 모니터링 알림 목록 조회 payload
 */
export interface GetMonitoringNotificationsPayload
  extends CorePayload,
    CorePaginate,
    CoreSearchText {}

/**
 * 모니터링 알림 생성 payload
 */
export interface CreateMonitoringNotificationPayload {
  [key: string]: unknown;
}

/**
 * 모니터링 알림 수정 payload
 */
export interface UpdateMonitoringNotificationPayload {
  [key: string]: unknown;
}

/**
 * 모니터링 알림 생성/수정 payload
 */
export interface UpsertMonitoringNotificationPayload {
  [key: string]: unknown;
}
