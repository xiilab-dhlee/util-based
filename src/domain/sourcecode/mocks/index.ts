import type { HttpHandler } from "msw";

import { getSourceCodeMock } from "@/api/generated/source-code/source-code.msw";
import { sourcecodeListOverrideHandlers } from "@/domain/sourcecode/mocks/sourcecode-list.override";

export const sourcecodeHandlers: HttpHandler[] = [
  // override 핸들러가 먼저 매칭되도록 배치
  ...sourcecodeListOverrideHandlers,
  // orval에서 생성된 기본 핸들러 (override되지 않은 엔드포인트용)
  ...getSourceCodeMock(),
];
