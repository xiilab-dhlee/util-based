import type { HttpHandler } from "msw";

import { getPrivateRegistryMock } from "@/api/generated/private-registry/private-registry.msw";
import { privateRegistryListOverrideHandlers } from "@/domain/private-registry/mocks/private-registry-list.override";

export const privateRegistryHandlers: HttpHandler[] = [
  ...privateRegistryListOverrideHandlers,
  ...getPrivateRegistryMock(),
];
