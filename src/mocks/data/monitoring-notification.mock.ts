import { MONITORING_NOTIFICATION_PAGE_SIZE } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import {
  monitoringNotificationDetailSchema,
  monitoringNotificationListSchema,
} from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 모니터링 알림 목록 Mock 데이터
 */
export const monitoringNotificationListMock = Array.from(
  { length: MONITORING_NOTIFICATION_PAGE_SIZE },
  () => makeMock(monitoringNotificationListSchema),
);

/**
 * 모니터링 알림 상세 Mock 데이터
 */
export const monitoringNotificationDetailMock = makeMock(
  monitoringNotificationDetailSchema,
);
