import type { HttpHandler } from "msw";

import { licenseOverrideHandlers } from "@/domain/auth/mocks/license.override";

/**
 * Auth 도메인 MSW 핸들러
 * 라이선스 관련 API Mock
 */
export const authHandlers: HttpHandler[] = [
  // Override handlers (우선순위 높음)
  ...licenseOverrideHandlers,
];
