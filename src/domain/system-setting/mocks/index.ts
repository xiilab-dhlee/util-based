import type { HttpHandler } from "msw";

import { getAdminWorkspaceMock } from "@/api/generated/admin-workspace/admin-workspace.msw";
import { policySetOverrideHandlers } from "@/domain/system-setting/mocks/policy-set.override";

export const systemSettingHandlers: HttpHandler[] = [
  ...policySetOverrideHandlers,
  ...getAdminWorkspaceMock(),
];
