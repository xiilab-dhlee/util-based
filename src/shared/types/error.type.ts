import type { BaseResponse } from "@/shared/types/api-response.type";

/**
 * 백엔드 비즈니스 로직 에러
 * HTTP 200 OK이지만 status가 FAIL/ERROR인 경우
 * axios-mutator에서 throw됨
 */
export class BackendError extends Error {
  constructor(
    message: string,
    public readonly response: BaseResponse,
  ) {
    super(message);
    this.name = "BackendError";
  }
}
