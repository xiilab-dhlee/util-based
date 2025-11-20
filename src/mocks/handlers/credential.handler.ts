import { HttpResponse, http } from "msw";

import { credentialListMock } from "@/mocks/data/credential.mock";

/**
 * 크레덴셜 API 핸들러
 */
export const credentialHandlers = [
  // 크레덴셜 목록 조회
  http.get("/core-api/v1/core/credential", () => {
    return HttpResponse.json({
      content: credentialListMock,
      totalSize: 100,
    });
  }),
];
