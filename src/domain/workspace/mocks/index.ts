import type { HttpHandler } from "msw";

import { getWorkspaceMock } from "@/api/generated/workspace/workspace.msw";
import { getWorkspaceMemberMock } from "@/api/generated/workspace-member/workspace-member.msw";
import { defaultResourceOverrideHandlers } from "@/domain/workspace/mocks/default-resource.override";
import { workspaceIdMatchOverrideHandlers } from "@/domain/workspace/mocks/workspace-id-match.override";
// import { leaveWorkspace403OverrideHandlers } from "@/domain/workspace/mocks/leave-workspace-403.override";

export const workspaceHandlers: HttpHandler[] = [
  ...workspaceIdMatchOverrideHandlers,
  ...defaultResourceOverrideHandlers,
  // ...leaveWorkspace403OverrideHandlers,
  ...getWorkspaceMock(),
  ...getWorkspaceMemberMock(),
];
