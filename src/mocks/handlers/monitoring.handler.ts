import { HttpResponse, http } from "msw";

import { userResourceListMock } from "@/mocks/data/monitoring.mock";
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
  // 사용자별 리소스 점유율 목록 조회
  http.get("/monitor-api/v1/core/monitor/user-resources", () => {
    return HttpResponse.json({
      content: userResourceListMock,
      totalSize: userResourceListMock.length,
    });
  }),
];
