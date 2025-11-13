import { setupServer } from "msw/node";

import { combinedHandlers } from "@/handlers";

/**
 * MSW 서버 설정
 */
export const server = setupServer(...combinedHandlers);

/**
 * MSW 서버 시작
 */
export function startMockServer() {
  server.listen({
    onUnhandledRequest: "bypass", // 모킹되지 않은 요청은 실제 서버로 전달
  });
}

/**
 *MSW 서버 종료
 */
export function stopMockServer() {
  server.close();
}

/**
 * 핸들러 리셋
 */
export function resetMockServer() {
  server.resetHandlers();
}
