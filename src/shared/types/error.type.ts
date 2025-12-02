// 에러 처리 관련 공통 타입

/**
 * 쿼리별 에러 설정 인터페이스
 */
export interface ErrorConfig {
  /** 토스트 표시 여부 */
  showToast: boolean;
  /** 기본 에러 메시지 */
  errorMessage: string;
  /** HTTP 상태 코드별 구체적 에러 메시지 */
  statusMessages?: Record<number, string>;
}

/**
 * 에러 설정 맵 타입
 * 쿼리 키 패턴(domain.action)을 키로 하는 에러 설정 객체
 */
export type ErrorConfigMap = Record<string, ErrorConfig>;
