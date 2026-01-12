import type { HttpHandler } from "msw";

import { getPrivateRegistryMock } from "@/api/generated/private-registry/private-registry.msw";
import { privateRegistryListOverrideHandlers } from "@/domain/private-registry/mocks/private-registry-list.override";
import { pullPushJobsOverrideHandlers } from "@/domain/private-registry/mocks/pull-push-jobs.override";

export const privateRegistryHandlers: HttpHandler[] = [
  ...privateRegistryListOverrideHandlers,
  ...pullPushJobsOverrideHandlers,
  ...getPrivateRegistryMock(),
];
