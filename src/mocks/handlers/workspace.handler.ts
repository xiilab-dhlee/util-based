import { HttpResponse, http } from "msw";

import {
  workspaceDetailMock,
  workspaceListMock,
} from "@/mocks/data/workspace.mock";

/**
 * 워크스페이스 API 핸들러
 */
export const workspaceHandlers = [
  // 워크스페이스 목록 조회
  http.get("/core-api/v1/core/workspace", () => {
    return HttpResponse.json({
      content: workspaceListMock,
      totalSize: 100,
    });
  }),

  // 워크스페이스 상세 조회
  http.get("/core-api/v1/core/workspace/:id", () => {
    return HttpResponse.json(workspaceDetailMock);
  }),
];
