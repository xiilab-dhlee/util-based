import { HttpResponse, http } from "msw";

import { privateRegistryListMock } from "@/mocks/data/private-registry.mock";

/**
 * 내부 레지스트리 API 핸들러
 */
export const privateRegistryHandlers = [
  // 내부 레지스트리 목록 조회
  http.get("/core-api/v1/core/private-registry", () => {
    return HttpResponse.json({
      content: privateRegistryListMock,
      totalSize: 100,
    });
  }),
];
