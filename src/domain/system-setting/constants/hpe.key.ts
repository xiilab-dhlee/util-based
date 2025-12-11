/**
 * HPE React Query 키 정의
 * 캐싱 및 무효화 관리에 사용
 */
export const hpeKeys = {
  default: ["hpe"] as const,
  detail: () => [...hpeKeys.default, "detail"] as const,
  update: () => [...hpeKeys.default, "update"] as const,
} as const;
