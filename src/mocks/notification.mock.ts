import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import {
  notificationDetailSchema,
  notificationListSchema,
} from "@/schemas/notification.schema";
import { makeMock } from "@/utils/common/mock.util";

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
