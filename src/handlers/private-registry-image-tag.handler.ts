import { HttpResponse, http } from "msw";

import { privateRegistryImageTagListMock } from "@/mocks/private-registry-image-tag.mock";

/**
 * 내부 레지스트리 이미지 태그 API 핸들러
 */
export const privateRegistryImageTagHandlers = [
  // 내부 레지스트리 이미지 태그 목록 조회
  http.get("/core-api/v1/core/private-registry-image/:id/tag", () => {
    return HttpResponse.json({
      content: privateRegistryImageTagListMock,
      totalSize: 100,
    });
  }),
];
