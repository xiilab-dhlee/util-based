export type BaseResponseStatus = "SUCCESS" | "FAIL" | "ERROR";

/**
 * 백엔드 공통 응답 엔벨로프 타입
 *
 * - HTTP Status가 200이어도 status가 FAIL/ERROR일 수 있으며, 이 경우 프론트에서 BackendError로 처리합니다.
 * - data는 상황에 따라 없을 수 있으며(null은 허용), SUCCESS에서 undefined인 경우는 계약 위반으로 간주합니다.
 */
export type BaseResponse<TData = unknown> = {
  status: BaseResponseStatus;
  timestamp: number;
  message?: string | null;
  data?: TData;
};
