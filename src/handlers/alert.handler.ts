import { HttpResponse, http } from "msw";

import { alertDetailMock, alertListMock } from "@/mocks/alert.mock";

/**
 * 알림 API 핸들러
 */
export const alertHandlers = [
  // 알림 목록 조회
  http.get("/core-api/v1/core/alert", () => {
    return HttpResponse.json({
      content: alertListMock,
      totalSize: 100,
    });
  }),
  // 알림 상세 조회
  http.get("/core-api/v1/core/alert/:id", () => {
    return HttpResponse.json(alertDetailMock);
  }),
];
