import {
  notificationDetailSchema,
  notificationListSchema,
} from "@/domain/notification/schemas/notification.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 알림 목록 Mock 데이터
 */
export const notificationListMock = Array.from({ length: LIST_PAGE_SIZE }, () =>
  makeMock(notificationListSchema),
);

/**
 * 알림 상세 Mock 데이터
 */
export const notificationDetailMock = makeMock(notificationDetailSchema);
