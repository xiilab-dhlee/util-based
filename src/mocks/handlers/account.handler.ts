import { HttpResponse, http } from "msw";

import { accountListMock } from "@/mocks/data/account.mock";

/**
 * 계정 관리 API 핸들러
 */
export const accountHandlers = [
  // 사용자 목록 조회
  http.get("/core-api/v1/core/account", () => {
    return HttpResponse.json({
      content: accountListMock,
      totalSize: 100,
    });
  }),
  // 가입 승인 목록 조회
  http.get("/core-api/v1/core/account/pending", () => {
    return HttpResponse.json({
      content: accountListMock,
      totalSize: 100,
    });
  }),
];
