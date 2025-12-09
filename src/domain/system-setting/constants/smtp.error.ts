import type { ErrorConfig } from "@/shared/types/error.type";

/**
 * SMTP 도메인 에러 설정
 */
export const smtpErrorConfig: Record<string, ErrorConfig> = {
  // GET 요청 (조회) - 토스트 표시 안함
  "smtp.detail": {
    showToast: false,
    errorMessage: "SMTP 설정을 불러올 수 없습니다.",
  },
  // Mutation 요청 (등록/수정) - 토스트 표시
  "smtp.create": {
    showToast: true,
    errorMessage: "SMTP 설정 등록에 실패했습니다.",
  },
  "smtp.update": {
    showToast: true,
    errorMessage: "SMTP 설정 수정에 실패했습니다.",
  },
};
