/**
 * 리소스 프리셋 크기 상수
 */
export const RESOURCE_PRESET_SIZES = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

/**
 * 리소스 프리셋 크기 타입
 */
export type ResourcePresetSize =
  (typeof RESOURCE_PRESET_SIZES)[keyof typeof RESOURCE_PRESET_SIZES];

/**
 * 리소스 프리셋 크기 레이블 매핑
 */
export const RESOURCE_PRESET_SIZE_LABELS: Record<ResourcePresetSize, string> = {
  [RESOURCE_PRESET_SIZES.SMALL]: "SMALL",
  [RESOURCE_PRESET_SIZES.MEDIUM]: "MEDIUM",
  [RESOURCE_PRESET_SIZES.LARGE]: "LARGE",
};

/**
 * 노드 타입 상수
 */
export const NODE_TYPES = {
  CPU: "CPU",
  GPU: "GPU",
} as const;

/**
 * 노드 타입 타입
 */
export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

/**
 * 노드 타입 레이블 매핑
 */
export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  [NODE_TYPES.CPU]: "CPU",
  [NODE_TYPES.GPU]: "GPU",
};
