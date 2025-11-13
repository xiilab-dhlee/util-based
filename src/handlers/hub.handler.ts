import { HttpResponse, http } from "msw";

import { hubDetailMock, hubListMock, hubReadmeMock } from "@/mocks/hub.mock";

export const hubHandlers = [
  // 허브 목록 조회
  http.get("/core-api/v1/core/hubs", () => {
    return HttpResponse.json({
      content: hubListMock,
      totalSize: 100,
    });
  }),

  // 허브 상세 조회
  http.get("/core-api/v1/core/hubs/:id", () => {
    return HttpResponse.json(hubDetailMock);
  }),

  // 허브 README 조회
  http.get("/core-api/v1/core/hubs/:id/readme", () => {
    return HttpResponse.json(hubReadmeMock);
  }),
];
