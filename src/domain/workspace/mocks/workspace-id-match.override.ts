import { HttpResponse, http } from "msw";

import { getGetAllWorkspacesResponseMock } from "@/api/generated/workspace/workspace.msw";

const TOTAL_WORKSPACES = 30;
const DEFAULT_PAGE_SIZE = 10;

const fixedContent = Array.from({ length: TOTAL_WORKSPACES }, (_, index) => {
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

export const workspaceIdMatchOverrideHandlers = [
  http.get("*/api/v1/workspaces", ({ request }) => {
    const base = getGetAllWorkspacesResponseMock();

    if (!base.data) {
      return HttpResponse.json(base, { status: 200 });
    }

    const url = new URL(request.url);
    const pageNo = parseInt(url.searchParams.get("pageNo") ?? "0", 10);
    const pageSize = parseInt(
      url.searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE),
      10,
    );
    const totalPageNum = Math.ceil(TOTAL_WORKSPACES / pageSize);
    const startIndex = pageNo * pageSize;
    const endIndex = Math.min(startIndex + pageSize, TOTAL_WORKSPACES);

    return HttpResponse.json(
      {
        ...base,
        data: {
          totalSize: TOTAL_WORKSPACES,
          totalPageNum,
          currentPageNo: pageNo,
          content: fixedContent.slice(startIndex, endIndex),
        },
      },
      { status: 200 },
    );
  }),
];
