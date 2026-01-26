/**
 * SSE(Server-Sent Events) 관련 상수 정의
 * 백엔드 직접 연결 (CORS 설정 필요)
 */

// SSE 연결용 백엔드 Base URL
export const SSE_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// SSE 엔드포인트
export const SSE_ENDPOINTS = {
  systemMetrics: (nodeName: string) =>
    `/sse/v1/admin/cluster/nodes/${encodeURIComponent(nodeName)}/resources/system/metrics/stream`,
  gpuMetrics: (nodeName: string) =>
    `/sse/v1/admin/cluster/nodes/${encodeURIComponent(nodeName)}/resources/gpu/metrics/stream`,
} as const;

/**
 * SSE가 Cross-Origin 연결인지 확인
 * Cross-Origin인 경우 CORS 설정이 필요함
 */
export function isSSECrossOrigin(): boolean {
  if (typeof window === "undefined") return false;
  if (!SSE_BASE_URL) return false;

  try {
    const sseOrigin = new URL(SSE_BASE_URL).origin;
    return sseOrigin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * SSE 연결 에러 메시지 생성
 * Cross-Origin인 경우 CORS 설정 안내 포함
 */
export function getSSEErrorMessage(baseMessage: string): string {
  if (isSSECrossOrigin()) {
    return `${baseMessage} (백엔드 CORS 설정을 확인하세요)`;
  }
  return baseMessage;
}
