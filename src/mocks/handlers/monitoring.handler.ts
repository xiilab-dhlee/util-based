import { HttpResponse, http } from "msw";

import {
  monitoringNotificationDetailMock,
  monitoringNotificationListMock,
} from "@/mocks/data/monitoring-notification.mock";

/**
 * 모니터링 API 핸들러
 */
export const monitoringHandlers = [
  // 모니터링 알림 목록 조회
  http.get("/monitor-api/v1/core/monitor/notifications", () => {
    return HttpResponse.json({
      content: monitoringNotificationListMock,
      totalSize: 100,
    });
  }),
  // 모니터링 알림 설정 상세 조회
  http.get("/monitor-api/v1/core/monitor/notifications/:id", () => {
    return HttpResponse.json(monitoringNotificationDetailMock);
  }),
];
