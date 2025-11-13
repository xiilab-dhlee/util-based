import { HttpResponse, http } from "msw";

import { requestImageListMock } from "@/mocks/request-image.mock";

/**
 * 이미지 요청 API 핸들러
 */
export const requestImageHandlers = [
  // 이미지 요청 목록 조회
  http.get("/core-api/v1/admin/request-image", () => {
    return HttpResponse.json({
      content: requestImageListMock,
      totalSize: 100,
    });
  }),

  // 이미지 요청 승인 대기 목록 조회
  http.get("/core-api/v1/admin/request-image/waiting", () => {
    return HttpResponse.json({
      content: requestImageListMock,
      totalSize: 100,
    });
  }),

  // 이미지 요청 상세 조회
  http.get("/core-api/v1/admin/request-image/:id", () => {
    return HttpResponse.json(requestImageListMock[0]);
  }),
];
