import { HttpResponse, http } from "msw";

import type {
  CredentialDetailType,
  CredentialListType,
} from "@/domain/credential/schemas/credential.schema";
import { credentialDetailMock } from "@/mocks/data/credential-detail.mock";
import type { CoreListResponse } from "@/shared/types/core.model";

const BASE_URL = "/core-api/v1/core/credential";

/**
 * 크레덴셜 전체 데이터 (목록 + 상세 통합)
 * DELETE 요청 시 제거됨
 */
let credentialState: CredentialDetailType[] = credentialDetailMock;

/**
 * 크레덴셜 API 핸들러
 */
export const credentialHandlers = [
  /**
   * 크레덴셜 목록 조회
   * GET /core-api/v1/core/credential
   */
  http.get(BASE_URL, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const page = Number(url.searchParams.get("page")) || 1;
    const size = Number(url.searchParams.get("size")) || 10;

    // 검색 필터링
    let filteredContent = credentialState;
    if (search) {
      filteredContent = filteredContent.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.creatorName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 페이지네이션
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedContent = filteredContent.slice(startIndex, endIndex);

    return HttpResponse.json<CoreListResponse<CredentialListType>>({
      content: paginatedContent,
      totalSize: filteredContent.length,
    });
  }),

  /**
   * 크레덴셜 상세 조회
   * GET /core-api/v1/core/credential/:id
   */
  http.get(`${BASE_URL}/:id`, ({ params }) => {
    const { id } = params;
    const credentialId = Number(id);

    // 전체 데이터에서 찾기
    const detail = credentialState.find((item) => item.id === credentialId);

    if (!detail) {
      return HttpResponse.json(
        { message: "크레덴셜을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json<CredentialDetailType>(detail);
  }),

  /**
   * 크레덴셜 삭제
   * DELETE /core-api/v1/core/credential/:id
   */
  http.delete(`${BASE_URL}/:id`, ({ params }) => {
    const { id } = params;
    const credentialId = Number(id);

    // 전체 데이터에서 제거
    credentialState = credentialState.filter(
      (item) => item.id !== credentialId,
    );

    return HttpResponse.json({ success: true });
  }),
];
