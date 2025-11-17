import type { Response } from "@playwright/test";
import { HttpResponse, http } from "msw";
import { type SetupServerApi, setupServer } from "msw/node";

import { nodeHandlers } from "@/handlers/node.handler";

/**
 * MSW 헬퍼 유틸리티
 * 테스트에서 MSW 서버를 쉽게 관리할 수 있도록 도와주는 헬퍼 함수들
 */
export class MSWHelper {
  private server: SetupServerApi;

  constructor(handlers = nodeHandlers) {
    this.server = setupServer(...handlers);
  }

  /**
   * MSW 서버 시작
   */
  async start() {
    await this.server.listen({ onUnhandledRequest: "bypass" });
  }

  /**
   * MSW 서버 중지
   */
  stop() {
    this.server.close();
  }

  /**
   * 핸들러 리셋
   */
  resetHandlers() {
    this.server.resetHandlers();
  }

  /**
   * 커스텀 핸들러 추가
   */
  useHandlers(...handlers: Handler[]) {
    this.server.use(...handlers);
  }

  /**
   * 특정 엔드포인트에 대한 커스텀 응답 설정
   */
  mockEndpoint(method: string, url: string, response: Response) {
    const handler = http[method.toLowerCase() as keyof typeof http](url, () =>
      HttpResponse.json(response),
    );
    this.server.use(handler);
  }
}
