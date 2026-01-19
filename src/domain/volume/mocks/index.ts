import type { HttpHandler } from "msw";

import { getVolumeMock } from "@/api/generated/volume/volume.msw";
import { volumeListOverrideHandlers } from "@/domain/volume/mocks/volume-list.override";

export const volumeHandlers: HttpHandler[] = [
  // override 핸들러가 먼저 매칭되도록 배치
  ...volumeListOverrideHandlers,
  // orval에서 생성된 기본 핸들러 (override되지 않은 엔드포인트용)
  ...getVolumeMock(),
];
