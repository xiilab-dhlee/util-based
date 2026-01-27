import type { HttpHandler } from "msw";

import { getWorkloadMock } from "@/api/generated/workload/workload.msw";
import { workloadFileListOverrideHandlers } from "@/domain/workload/mocks/workload-file-list.override";
import { workloadFilePreviewOverrideHandlers } from "@/domain/workload/mocks/workload-file-preview.override";

export const workloadHandlers: HttpHandler[] = [
  // override 핸들러가 먼저 매칭되도록 배치
  ...workloadFileListOverrideHandlers,
  ...workloadFilePreviewOverrideHandlers,
  // orval에서 생성된 기본 핸들러 (override되지 않은 엔드포인트용)
  ...getWorkloadMock(),
];
