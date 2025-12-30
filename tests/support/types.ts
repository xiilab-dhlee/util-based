/**
 * E2E 테스트 공용 타입 정의
 *
 * 여러 도메인에서 재사용되는 타입들을 중앙 관리
 */

/**
 * 목록 페이지 필터 조건
 *
 * DataTable에서 파싱한 필터 조건 구조
 * - "-" 값은 "설정하지 않음"을 의미
 *
 * @example
 * // Feature 파일 (필터만)
 * | jobType | status |
 * | Batch   | -      |
 */
export interface FilterCondition {
  jobType: string;
  status: string;
}
