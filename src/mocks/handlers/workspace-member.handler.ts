import { HttpResponse, http } from "msw";

import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import { createWorkspaceMemberListMock } from "@/mocks/data/workspace-member.mock";
import { WORKSPACE_MEMBER_ENDPOINTS } from "@/shared/constants/endpoint.constant";
import { paramsToOverride } from "@/shared/utils/service.util";

/**
 * 워크스페이스 멤버 API 핸들러
 */
export const workspaceMemberHandlers = [
  // 워크스페이스 멤버 목록 조회
  http.get(WORKSPACE_MEMBER_ENDPOINTS.base, ({ request }) => {
    const url = new URL(request.url);

    const override = paramsToOverride<WorkspaceMemberListType>(
      url.searchParams,
    );
    const content = createWorkspaceMemberListMock(override);

    return HttpResponse.json({
      content,
      totalSize: 100,
    });
  }),
];
