import { HttpResponse, http } from "msw";

import type { RequestResourceListType } from "@/domain/request-resource/schemas/request-resource.schema";
import { createRequestResourceListMock } from "@/mocks/data/request-resource.mock";
import { REQUEST_RESOURCE_ENDPOINTS } from "@/shared/constants/endpoint.constant";
import { paramsToOverride } from "@/shared/utils/service.util";

/**
 * 리소스 요청 API 핸들러
 */
export const requestResourceHandlers = [
  // 리소스 요청 목록 조회
  http.get(REQUEST_RESOURCE_ENDPOINTS.base, ({ request }) => {
    const url = new URL(request.url);

    const override = paramsToOverride<RequestResourceListType>(
      url.searchParams,
    );
    const content = createRequestResourceListMock(override);

    return HttpResponse.json({
      content,
      totalSize: 100,
    });
  }),
];
