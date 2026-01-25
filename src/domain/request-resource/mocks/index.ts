import type { HttpHandler } from "msw";

import { resourceRequestDetailOverrideHandlers } from "@/domain/request-resource/mocks/resource-request-detail.override";

export const requestResourceHandlers: HttpHandler[] = [
  // Override handlers (우선순위 높음)
  ...resourceRequestDetailOverrideHandlers,
];
