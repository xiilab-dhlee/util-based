import { HttpResponse, http } from "msw";

import {
  workspaceListMock,
  workspaceMemberListMock,
  workspaceRequestResourceListMock,
} from "@/mocks/workspace.mock";

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

  // 워크스페이스 멤버 목록 조회
  http.get("/core-api/v1/core/workspace/member", () => {
    return HttpResponse.json({
      content: workspaceMemberListMock,
      totalSize: 100,
    });
  }),

  // 워크스페이스 리소스 요청 목록 조회
  http.get("/core-api/v1/core/workspace/admin/resource", () => {
    return HttpResponse.json({
      content: workspaceRequestResourceListMock,
      totalSize: 100,
    });
  }),
];
