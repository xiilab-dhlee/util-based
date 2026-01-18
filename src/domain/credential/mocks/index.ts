import type { HttpHandler } from "msw";

import { getCredentialMock } from "@/api/generated/credential/credential.msw";
import { credentialListOverrideHandlers } from "@/domain/credential/mocks/credential-list.override";

export const credentialHandlers: HttpHandler[] = [
  ...credentialListOverrideHandlers,
  ...getCredentialMock(),
];
