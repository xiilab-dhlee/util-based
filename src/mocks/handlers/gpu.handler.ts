import { HttpResponse, http } from "msw";

import {
  gpuListMock,
  gpuNodeListMock,
  gpuProfileListMock,
} from "@/mocks/data/gpu.mock";

/**
 * GPU API 핸들러
 */
export const gpuHandlers = [
  // GPU 목록 조회
  http.get("/core-api/v1/core/gpu", () => {
    return HttpResponse.json({
      content: gpuListMock,
      totalSize: gpuListMock.length,
    });
  }),

  // GPU 노드 목록 조회
  http.get("/core-api/v1/core/gpu/nodes", () => {
    return HttpResponse.json({
      content: gpuNodeListMock,
      totalSize: gpuNodeListMock.length,
    });
  }),

  // GPU 프로파일 목록 조회
  http.get("/core-api/v1/core/gpu/profiles", () => {
    return HttpResponse.json({
      content: gpuProfileListMock,
      totalSize: gpuProfileListMock.length,
    });
  }),
];
