import { HttpResponse, http } from "msw";

import {
  privateRegistryImageDetailMock,
  privateRegistryImageListMock,
  privateRegistryImageTagDetailMock,
  privateRegistryImageTagListMock,
  privateRegistryImageTagVulnerabilityListMock,
} from "@/mocks/data/private-registry-image.mock";

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
  // 관리자 내부 레지스트리 이미지 목록 조회
  http.get("/core-api/v1/core/admin/private-registry-image", () => {
    return HttpResponse.json({
      content: privateRegistryImageListMock,
      totalSize: 100,
    });
  }),
  // 관리자 내부 레지스트리 이미지 태그 목록 조회
  http.get(
    "/core-api/v1/core/admin/private-registry-image/:name/:id/tag",
    () => {
      return HttpResponse.json({
        content: privateRegistryImageTagListMock,
        totalSize: 100,
      });
    },
  ),
  // 관리자 내부 레지스트리 이미지 상세 조회
  http.get("/core-api/v1/core/admin/private-registry-image/:name/:id", () => {
    return HttpResponse.json(privateRegistryImageDetailMock);
  }),
  // 내부 레지스트리 이미지 취약점 목록 조회
  http.get(
    "/core-api/v1/core/private-registry-image/:id/tag/:tagId/vulnerability",
    () => {
      return HttpResponse.json({
        content: privateRegistryImageTagVulnerabilityListMock,
        totalSize: 100,
      });
    },
  ),
  // 내부 레지스트리 이미지 태그 상세 조회
  http.get("/core-api/v1/core/private-registry-image/:id/tag/:tagId", () => {
    return HttpResponse.json(privateRegistryImageTagDetailMock);
  }),
  // 내부 레지스트리 이미지 태그 목록 조회
  http.get("/core-api/v1/core/private-registry-image/:id/tag", () => {
    return HttpResponse.json({
      content: privateRegistryImageTagListMock,
      totalSize: 100,
    });
  }),
  // 내부 레지스트리 이미지 상세 조회
  http.get("/core-api/v1/core/private-registry-image/:id", () => {
    return HttpResponse.json(privateRegistryImageDetailMock);
  }),
];
