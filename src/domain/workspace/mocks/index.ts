import type { HttpHandler } from "msw";

import { getWorkspaceMock } from "@/api/generated/workspace/workspace.msw";
import { defaultResourceOverrideHandlers } from "@/domain/workspace/mocks/default-resource.override";

export const workspaceHandlers: HttpHandler[] = [
  ...defaultResourceOverrideHandlers,
  ...getWorkspaceMock(),
];
