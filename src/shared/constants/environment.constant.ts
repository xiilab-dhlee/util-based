/**
 * 환경 타입 상수
 */
export const ENVIRONMENT_TYPES = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
  STAGING: "staging",
} as const;

/**
 * 환경 타입 타입
 */
export type EnvironmentType =
  (typeof ENVIRONMENT_TYPES)[keyof typeof ENVIRONMENT_TYPES];

/**
 * 환경 타입 레이블 매핑
 */
export const ENVIRONMENT_TYPE_LABELS: Record<EnvironmentType, string> = {
  [ENVIRONMENT_TYPES.PRODUCTION]: "Production",
  [ENVIRONMENT_TYPES.DEVELOPMENT]: "Development",
  [ENVIRONMENT_TYPES.STAGING]: "Staging",
};
