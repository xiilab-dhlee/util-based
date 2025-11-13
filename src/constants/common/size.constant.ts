/**
 * 컴포넌트 크기 상수
 */
export const COMPONENT_SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

/**
 * 컴포넌트 크기 타입
 */
export type ComponentSize =
  (typeof COMPONENT_SIZES)[keyof typeof COMPONENT_SIZES];

/**
 * 컴포넌트 크기 레이블 매핑
 */
export const COMPONENT_SIZE_LABELS: Record<ComponentSize, string> = {
  [COMPONENT_SIZES.SMALL]: "Small",
  [COMPONENT_SIZES.MEDIUM]: "Medium",
  [COMPONENT_SIZES.LARGE]: "Large",
};
