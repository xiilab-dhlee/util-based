import { HttpResponse, http } from "msw";

import {
  notificationDetailMock,
  notificationListMock,
} from "@/mocks/data/notification.mock";

/**
 * 알림 API 핸들러
 */
export const notificationHandlers = [
  // 알림 목록 조회
  http.get("/core-api/v1/core/notification", () => {
    return HttpResponse.json({
      content: notificationListMock,
      totalSize: 100,
    });
  }),
  // 알림 상세 조회
  http.get("/core-api/v1/core/notification/:id", () => {
    return HttpResponse.json(notificationDetailMock);
  }),
];
