/**
 * 공용 검증 패턴 (Validation Patterns)
 *
 * E2E 테스트에서 공통으로 사용되는 정규식 패턴 모음
 * - 여러 도메인(워크로드, 소스코드, 볼륨 등)에서 재사용
 * - Step Definition에서 import하여 사용
 */

// ============================================
// String Type Aliases
// ============================================

/**
 * 상대 시간 문자열 형식
 *
 * RELATIVE_TIME_PATTERN과 일치하는 정확한 타입 정의
 *
 * @example "방금 전"
 * @example "5분 전"
 * @example "3시간 전"
 * @example "2일 전"
 * @example "2일 3시간 전"
 * @example "2일 30분 전"
 * @example "2일 3시간 30분 전"
 */
export type RelativeTimeString =
  | "방금 전"
  | `${number}분 전`
  | `${number}시간 전`
  | `${number}일 전`
  | `${number}일 ${number}시간 전`
  | `${number}일 ${number}분 전`
  | `${number}일 ${number}시간 ${number}분 전`;

/**
 * 날짜/시간 문자열 형식 (yyyy.MM.dd HH:mm:ss)
 *
 * @example "2024.01.15 14:30:00"
 * @example "2025.12.31 23:59:59"
 */
export type DateTimeString =
  `${number}.${number}.${number} ${number}:${number}:${number}`;

/**
 * 날짜 문자열 형식 (yyyy.MM.dd)
 *
 * @example "2024.01.15"
 * @example "2025.12.31"
 */
export type DateString = `${number}.${number}.${number}`;

// ============================================
// RegExp Patterns
// ============================================

/**
 * 상대 시간 표시 패턴 (formatElapsedTime 출력 형식)
 *
 * 매칭 예시:
 * - "방금 전"
 * - "5분 전"
 * - "3시간 전"
 * - "2일 전"
 * - "2일 3시간 전"
 * - "2일 30분 전"
 * - "2일 3시간 30분 전"
 *
 * @see src/shared/utils/date.util.ts - formatElapsedTime
 */
export const RELATIVE_TIME_PATTERN: RegExp =
  /^(방금 전|\d+분 전|\d+시간 전|\d+일 전|\d+일 \d+시간 전|\d+일 \d+분 전|\d+일 \d+시간 \d+분 전)$/;

/**
 * 날짜/시간 표시 패턴 (yyyy.MM.dd HH:mm:ss)
 *
 * 매칭 예시:
 * - "2024.01.15 14:30:00"
 * - "2025.12.31 23:59:59"
 */
export const DATETIME_PATTERN: RegExp =
  /^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}$/;

/**
 * 날짜 표시 패턴 (yyyy.MM.dd)
 *
 * 매칭 예시:
 * - "2024.01.15"
 * - "2025.12.31"
 */
export const DATE_PATTERN: RegExp = /^\d{4}\.\d{2}\.\d{2}$/;

/**
 * 개수 표시 패턴 (n개, 천단위 콤마 지원)
 *
 * 매칭 예시:
 * - "0개"
 * - "5개"
 * - "100개"
 * - "1,000개"
 * - "10,000개"
 */
export const COUNT_PATTERN: RegExp = /^[\d,]+개$/;
