import { HttpResponse, http } from "msw";

import {
  internalregistryImageDetailMock,
  internalregistryImageListMock,
  internalregistryImageTagDetailMock,
  internalregistryImageTagListMock,
  internalregistryImageTagVulnerabilityListMock,
} from "@/mocks/data/internal-registry-image.mock";

/**
 * 내부 레지스트리 이미지 API 핸들러
 */
export const internalregistryImageHandlers = [
  // 내부 레지스트리 이미지 목록 조회
  http.get("/core-api/v1/core/internal-registry-image", () => {
    return HttpResponse.json({
      content: internalregistryImageListMock,
      totalSize: 100,
    });
  }),
  // 관리자 내부 레지스트리 이미지 목록 조회
  http.get("/core-api/v1/core/admin/internal-registry-image", () => {
    return HttpResponse.json({
      content: internalregistryImageListMock,
      totalSize: 100,
    });
  }),
  // 관리자 내부 레지스트리 이미지 태그 목록 조회
  http.get(
    "/core-api/v1/core/admin/internal-registry-image/:name/:id/tag",
    () => {
      return HttpResponse.json({
        content: internalregistryImageTagListMock,
        totalSize: 100,
      });
    },
  ),
  // 관리자 내부 레지스트리 이미지 상세 조회
  http.get("/core-api/v1/core/admin/internal-registry-image/:name/:id", () => {
    return HttpResponse.json(internalregistryImageDetailMock);
  }),
  // 내부 레지스트리 이미지 취약점 목록 조회
  http.get(
    "/core-api/v1/core/internal-registry-image/:id/tag/:tagId/vulnerability",
    () => {
      return HttpResponse.json({
        content: internalregistryImageTagVulnerabilityListMock,
        totalSize: 100,
      });
    },
  ),
  // 내부 레지스트리 이미지 태그 상세 조회
  http.get("/core-api/v1/core/internal-registry-image/:id/tag/:tagId", () => {
    return HttpResponse.json(internalregistryImageTagDetailMock);
  }),
  // 내부 레지스트리 이미지 태그 목록 조회
  http.get("/core-api/v1/core/internal-registry-image/:id/tag", () => {
    return HttpResponse.json({
      content: internalregistryImageTagListMock,
      totalSize: 100,
    });
  }),
  // 내부 레지스트리 이미지 상세 조회
  http.get("/core-api/v1/core/internal-registry-image/:id", () => {
    return HttpResponse.json(internalregistryImageDetailMock);
  }),
];
