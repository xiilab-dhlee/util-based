import { delay, HttpResponse, http } from "msw";

import { WORKSPACE_ERROR_CODES } from "@/domain/workspace/constants/workspace-error-code.constant";

export const leaveWorkspace403OverrideHandlers = [
  http.post("*/api/v1/workspaces/:workspaceId/leave", async () => {
    await delay(1000);

    const errorPayload = {
      errorCode: WORKSPACE_ERROR_CODES.CANNOT_LEAVE_AS_ONLY_OWNER,
      message: "워크스페이스에 유일한 OWNER이므로 탈퇴할 수 없습니다",
      success: false,
    };

    return HttpResponse.json(errorPayload, { status: 403 });
  }),
];
