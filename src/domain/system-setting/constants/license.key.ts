/**
 * 라이선스 관련 React Query 키
 * 캐시 관리 및 무효화에 사용
 */
export const licenseKeys = {
  default: ["license"],
  detail: () => [...licenseKeys.default, "detail"],
  renew: () => [...licenseKeys.default, "renew"],
} as const;
