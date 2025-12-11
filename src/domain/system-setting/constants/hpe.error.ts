/**
 * HPE API 에러 설정
 * Query Key 기반으로 에러 처리
 */
export const hpeErrorConfig = {
  "hpe.detail": {
    showToast: false,
    errorMessage: "HPE OneView 연동 정보를 불러오는 중 오류가 발생했습니다.",
  },
  "hpe.update": {
    showToast: true,
    errorMessage: "HPE OneView 연동에 실패했습니다.",
  },
} as const;
