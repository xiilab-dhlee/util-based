/**
 * 리소스 회수 기준 폼 유효성 검사 상수
 * - METRICS: GPU, CPU, Memory 임계값 (0-100%)
 * - OPERATING_HOUR: 검사 주기 (최소 1시간, 최대 24시간)
 * - WARNING_COUNT: 경고 횟수 (최소 1회, 상한 없음)
 */
export const REVOKE_CRITERIA_LIMITS = {
  METRICS: {
    MIN: 0,
    MAX: 100,
  },
  OPERATING_HOUR: {
    MIN: 1,
    MAX: 24,
  },
  WARNING_COUNT: {
    MIN: 1,
  },
} as const;

/**
 * 회수 정책 적용 대상 잡 타입
 * - BATCH: 배치 잡
 * - INTERACTIVE: 인터랙티브 잡
 *
 * @note DISTRIBUTED는 회수 정책 대상에서 제외됨
 */
export const RECLAIM_POLICY_JOB_TYPES = {
  BATCH: "BATCH",
  INTERACTIVE: "INTERACTIVE",
} as const;

export type ReclaimPolicyJobType =
  (typeof RECLAIM_POLICY_JOB_TYPES)[keyof typeof RECLAIM_POLICY_JOB_TYPES];
