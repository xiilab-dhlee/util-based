import { HttpResponse, http } from "msw";

import { getGetAllWorkspacesResponseMock } from "@/api/generated/workspace/workspace.msw";

export const workspaceIdMatchOverrideHandlers = [
  http.get("*/api/v1/workspaces", () => {
    const base = getGetAllWorkspacesResponseMock();

    if (!base.data) {
      return HttpResponse.json(base, { status: 200 });
    }

    const fixedContent = Array.from({ length: 5 }, (_, index) => {
      const baseMock = getGetAllWorkspacesResponseMock();
      const firstItem = baseMock.data?.content?.[0];

      return {
        ...firstItem,
        workspaceId: index + 1,
        workspaceName: `Workspace ${index + 1}`,
        description: `Test workspace ${index + 1}`,
        isDefault: index === 0,
        isPinned: false,
      };
    });

    return HttpResponse.json(
      {
        ...base,
        data: {
          totalSize: 5,
          totalPageNum: 1,
          currentPageNo: 0,
          content: fixedContent,
        },
      },
      { status: 200 },
    );
  }),
];
