import { HttpResponse, http } from "msw";

import { accountDetailResponseSchema } from "@/domain/account-management/schemas/account.schema";
import { accountListMock } from "@/mocks/data/account.mock";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 계정 관리 API 핸들러
 */
export const accountHandlers = [
  // 사용자 목록 조회
  http.get("/api/v1/core/account", () => {
    return HttpResponse.json({
      content: accountListMock,
      totalSize: 100,
    });
  }),
  // 가입 승인 목록 조회
  http.get("/api/v1/core/account/pending", () => {
    return HttpResponse.json({
      content: accountListMock,
      totalSize: 100,
    });
  }),
  // 계정 상세 조회
  http.get("/api/v1/core/account/:accountId", ({ params }) => {
    const { accountId } = params;

    const account = accountListMock.find((item) => item.id === accountId);

    if (!account) {
      // 그룹 트리 등에서 오는 accountId와 목록 ID가 다를 수 있으므로,
      // 상세 응답 스키마 기준으로 mock 을 생성해 fallback 처리
      const mock = makeMock(accountDetailResponseSchema);
      return HttpResponse.json({
        ...mock,
        id: String(accountId),
      });
    }

    return HttpResponse.json(account);
  }),
];
