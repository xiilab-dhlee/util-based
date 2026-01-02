import { HttpResponse, http } from "msw";

import type {
  CredentialDetailType,
  CredentialListType,
} from "@/domain/credential/schemas/credential.schema";
import { createCredentialListMock } from "@/mocks/data/credential.mock";
import { credentialDetailMock } from "@/mocks/data/credential-detail.mock";
import { CREDENTIAL_ENDPOINTS } from "@/shared/constants/endpoint.constant";
import { paramsToOverride } from "@/shared/utils/service.util";

/**
 * 크리덴셜 상세 데이터 상태
 * DELETE 요청 시 제거됨
 */
let credentialDetailState: CredentialDetailType[] = credentialDetailMock;

/**
 * 크리덴셜 API 핸들러
 */
export const credentialHandlers = [
  /**
   * 크리덴셜 목록 조회
   * GET /core-api/v1/core/credential
   */
  http.get(CREDENTIAL_ENDPOINTS.base, ({ request }) => {
    const url = new URL(request.url);

    const override = paramsToOverride<CredentialListType>(url.searchParams);
    const content = createCredentialListMock(override);

    return HttpResponse.json({
      content,
      totalSize: 100,
    });
  }),

  /**
   * 크리덴셜 상세 조회
   * GET /core-api/v1/core/credential/:id
   */
  http.get(`${CREDENTIAL_ENDPOINTS.base}/:id`, ({ params }) => {
    const { id } = params;
    const credentialId = Number(id);

    // 전체 데이터에서 찾기
    const detail = credentialDetailState.find(
      (item) => item.id === credentialId,
    );

    if (!detail) {
      return HttpResponse.json(
        { message: "크리덴셜을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json<CredentialDetailType>(detail);
  }),

  /**
   * 크리덴셜 삭제
   * DELETE /core-api/v1/core/credential/:id
   */
  http.delete(`${CREDENTIAL_ENDPOINTS.base}/:id`, ({ params }) => {
    const { id } = params;
    const credentialId = Number(id);

    // 전체 데이터에서 제거
    credentialDetailState = credentialDetailState.filter(
      (item) => item.id !== credentialId,
    );

    return HttpResponse.json({ success: true });
  }),
];
