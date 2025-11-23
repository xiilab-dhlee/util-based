import { HttpResponse, http } from "msw";

import { internalregistryListMock } from "@/mocks/data/internal-registry.mock";

/**
 * 내부 레지스트리 API 핸들러
 */
export const internalregistryHandlers = [
  // 내부 레지스트리 목록 조회
  http.get("/core-api/v1/core/internal-registry", () => {
    return HttpResponse.json({
      content: internalregistryListMock,
      totalSize: 100,
    });
  }),
];
