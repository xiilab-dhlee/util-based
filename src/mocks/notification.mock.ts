import notificationListConstants from "@/constants/notification/notification-list.constant";
import { notificationDetailSchema, notificationListSchema } from "@/schemas/notification.schema";
import { makeMock } from "@/utils/common/mock.util";

/**
 * 알림 목록 Mock 데이터
 */
export const notificationListMock = Array.from(
  { length: notificationListConstants.pageSize },
  () => makeMock(notificationListSchema),
);

/**
 * 알림 상세 Mock 데이터
 */
export const notificationDetailMock = makeMock(notificationDetailSchema);

