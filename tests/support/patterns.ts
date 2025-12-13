/**
 * 공용 검증 패턴 (Validation Patterns)
 *
 * E2E 테스트에서 공통으로 사용되는 정규식 패턴 모음
 * - 여러 도메인(워크로드, 소스코드, 볼륨 등)에서 재사용
 * - Step Definition에서 import하여 사용
 */

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
export const RELATIVE_TIME_PATTERN =
  /^(방금 전|\d+분 전|\d+시간 전|\d+일 전|\d+일 \d+시간 전|\d+일 \d+분 전|\d+일 \d+시간 \d+분 전)$/;

/**
 * 날짜/시간 표시 패턴 (yyyy.MM.dd HH:mm:ss)
 *
 * 매칭 예시:
 * - "2024.01.15 14:30:00"
 * - "2025.12.31 23:59:59"
 */
export const DATETIME_PATTERN = /^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}:\d{2}$/;

/**
 * 날짜 표시 패턴 (yyyy.MM.dd)
 *
 * 매칭 예시:
 * - "2024.01.15"
 * - "2025.12.31"
 */
export const DATE_PATTERN = /^\d{4}\.\d{2}\.\d{2}$/;
