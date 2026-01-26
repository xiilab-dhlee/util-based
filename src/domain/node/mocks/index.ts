import type { HttpHandler } from "msw";

import { getAdminClusterMock } from "@/api/generated/admin-cluster/admin-cluster.msw";
import { migConfigOverrideHandlers } from "@/domain/node/mocks/mig-config.override";
import { nodeListOverrideHandlers } from "@/domain/node/mocks/node-list.override";

export const nodeHandlers: HttpHandler[] = [
  // Override handlers (우선순위 높음)
  ...nodeListOverrideHandlers,
  ...migConfigOverrideHandlers,
  // Default mock handlers
  ...getAdminClusterMock(),
];
