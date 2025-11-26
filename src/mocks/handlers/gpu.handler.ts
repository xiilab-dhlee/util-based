import { HttpResponse, http } from "msw";

import {
  gpuListMock,
  gpuNodeListMock,
  gpuProfileListMock,
} from "../data/gpu.mock";

/**
 * GPU API 핸들러
 */
export const gpuHandlers = [
  // GPU 목록 조회
  http.get("/core-api/v1/core/gpu", () => {
    return HttpResponse.json({
      content: gpuListMock,
    });
  }),

  // GPU 노드 목록 조회
  http.get("/core-api/v1/core/gpu/nodes", () => {
    return HttpResponse.json({
      content: gpuNodeListMock,
    });
  }),

  // GPU 프로파일 목록 조회
  http.get("/core-api/v1/core/gpu/profiles", () => {
    return HttpResponse.json({
      content: gpuProfileListMock,
    });
  }),
];
