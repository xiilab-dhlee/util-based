/**
 * 라이선스 API 에러 설정
 */
export const licenseErrorConfig = {
  "license.detail": {
    showToast: false,
    errorMessage: "라이선스 정보를 불러오는 중 오류가 발생했습니다.",
  },
  "license.renew": {
    showToast: true,
    errorMessage: "라이선스 갱신에 실패했습니다.",
  },
} as const;
