/**
 * 보안 취약점 심각도 레벨 상수
 */
export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

/**
 * 심각도 레벨 타입
 */
export type SeverityLevel =
  (typeof SEVERITY_LEVELS)[keyof typeof SEVERITY_LEVELS];

/**
 * 심각도 레벨 레이블 매핑
 */
export const SEVERITY_LEVEL_LABELS: Record<SeverityLevel, string> = {
  [SEVERITY_LEVELS.LOW]: "Low",
  [SEVERITY_LEVELS.MEDIUM]: "Medium",
  [SEVERITY_LEVELS.HIGH]: "High",
  [SEVERITY_LEVELS.CRITICAL]: "Critical",
};

/**
 * 심각도 레벨 색상 매핑
 */
export const SEVERITY_LEVEL_COLORS: Record<SeverityLevel, string> = {
  [SEVERITY_LEVELS.LOW]: "#98BDFF",
  [SEVERITY_LEVELS.MEDIUM]: "#98BDFF",
  [SEVERITY_LEVELS.HIGH]: "#FFBE5B",
  [SEVERITY_LEVELS.CRITICAL]: "#FF5B5B",
};

/**
 * 심각도 레벨 보조 색상 매핑 (상세 페이지용)
 */
export const SEVERITY_LEVEL_SECONDARY_COLORS: Record<SeverityLevel, string> = {
  [SEVERITY_LEVELS.LOW]: "#366BFF",
  [SEVERITY_LEVELS.MEDIUM]: "#366BFF",
  [SEVERITY_LEVELS.HIGH]: "#FFA052",
  [SEVERITY_LEVELS.CRITICAL]: "#FF4D4D",
};
