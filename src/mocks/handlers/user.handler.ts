import { HttpResponse, http } from "msw";

import { userListMock } from "@/mocks/data/user.mock";

/**
 * 사용자 API 핸들러
 */
export const userHandlers = [
  // 사용자 목록 조회
  http.get("/core-api/v1/core/user", () => {
    return HttpResponse.json({
      content: userListMock,
      totalSize: 100,
    });
  }),
  // 가입 승인 목록 조회
  http.get("/core-api/v1/core/user/pending", () => {
    return HttpResponse.json({
      content: userListMock,
      totalSize: 100,
    });
  }),
];
