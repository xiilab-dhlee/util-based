import { HttpResponse, http } from "msw";

import { userResourceListMock } from "@/mocks/data/monitoring.mock";

/**
 * 모니터링 API 핸들러
 */
export const monitoringHandlers = [
  http.get("/monitor-api/v1/core/monitor/user-resources", () => {
    return HttpResponse.json({
      content: userResourceListMock,
      totalSize: userResourceListMock.length,
    });
  }),
];
