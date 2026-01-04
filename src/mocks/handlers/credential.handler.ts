import { HttpResponse, http } from "msw";

import type { CredentialListType } from "@/domain/credential/schemas/credential.schema";
import {
  createCredentialListMock,
  credentialDetailMock,
} from "@/mocks/data/credential.mock";
import { CREDENTIAL_ENDPOINTS } from "@/shared/constants/endpoint.constant";
import { paramsToOverride } from "@/shared/utils/service.util";

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
  http.get(`${CREDENTIAL_ENDPOINTS.base}/:id`, () => {
    return HttpResponse.json(credentialDetailMock);
  }),

  /**
   * 크리덴셜 생성
   * POST /core-api/v1/core/credential
   */
  http.post(CREDENTIAL_ENDPOINTS.base, async () => {
    return HttpResponse.json({ success: true });
  }),

  /**
   * 크리덴셜 삭제
   * DELETE /core-api/v1/core/credential/:id
   */
  http.delete(`${CREDENTIAL_ENDPOINTS.base}/:id`, () => {
    return HttpResponse.json({ success: true });
  }),
];
