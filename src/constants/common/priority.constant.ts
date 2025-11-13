/**
 * 우선순위 레벨 상수
 */
export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

/**
 * 우선순위 레벨 타입
 */
export type PriorityLevel =
  (typeof PRIORITY_LEVELS)[keyof typeof PRIORITY_LEVELS];

/**
 * 우선순위 레벨 레이블 매핑
 */
export const PRIORITY_LEVEL_LABELS: Record<PriorityLevel, string> = {
  [PRIORITY_LEVELS.LOW]: "Low",
  [PRIORITY_LEVELS.MEDIUM]: "Medium",
  [PRIORITY_LEVELS.HIGH]: "High",
};
