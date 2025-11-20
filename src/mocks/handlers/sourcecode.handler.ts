import { HttpResponse, http } from "msw";

import {
  sourcecodeDetailMock,
  sourcecodeListMock,
} from "@/mocks/data/sourcecode.mock";

/**
 * 소스코드 API 핸들러
 */
export const sourcecodeHandlers = [
  // 소스코드 목록 조회
  http.get("/core-api/v1/core/sourcecode", () => {
    return HttpResponse.json({
      content: sourcecodeListMock,
      totalSize: 100,
    });
  }),
  // 소스코드 상세 조회
  http.get("/core-api/v1/core/sourcecode/:id", () => {
    return HttpResponse.json(sourcecodeDetailMock);
  }),
];
