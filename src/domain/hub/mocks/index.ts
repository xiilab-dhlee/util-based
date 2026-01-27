import type { HttpHandler } from "msw";

import { getHubMock } from "@/api/generated/hub/hub.msw";
import { hubDetailOverrideHandlers } from "@/domain/hub/mocks/hub-detail.override";
import { hubListOverrideHandlers } from "@/domain/hub/mocks/hub-list.override";

export const hubHandlers: HttpHandler[] = [
  // override 핸들러가 먼저 매칭되도록 배치
  ...hubListOverrideHandlers,
  ...hubDetailOverrideHandlers,
  // orval에서 생성된 기본 핸들러 (override되지 않은 엔드포인트용)
  ...getHubMock(),
];
