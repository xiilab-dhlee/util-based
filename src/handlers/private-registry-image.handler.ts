import { HttpResponse, http } from "msw";

import {
  privateRegistryImageDetailMock,
  privateRegistryImageListMock,
} from "@/mocks/private-registry-image.mock";

/**
 * 내부 레지스트리 이미지 API 핸들러
 */
export const privateRegistryImageHandlers = [
  // 내부 레지스트리 이미지 목록 조회
  http.get("/core-api/v1/core/private-registry-image", () => {
    return HttpResponse.json({
      content: privateRegistryImageListMock,
      totalSize: 100,
    });
  }),
  // 내부 레지스트리 이미지 상세 조회
  http.get("/core-api/v1/core/private-registry-image/:id", () => {
    return HttpResponse.json(privateRegistryImageDetailMock);
  }),
];
