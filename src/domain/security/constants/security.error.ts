import type { ErrorConfig } from "@/shared/types/error.type";

/**
 * 보안 도메인(파일/레지스트리) 에러 설정
 */
export const securityErrorConfig: Record<string, ErrorConfig> = {
  // Mutation 요청 (파일 보안 레벨 설정 수정)
  "file-security.securityLevel": {
    showToast: true,
    errorMessage: "파일 보안 레벨 설정 저장에 실패했습니다.",
  },
  // Mutation 요청 (파일 보안 스케줄 설정 수정)
  "file-security.securitySchedule": {
    showToast: true,
    errorMessage: "파일 보안 스케줄 설정 저장에 실패했습니다.",
  },
  // Mutation 요청 (레지스트리 보안 레벨 설정 수정)
  "registry-security.securityLevel": {
    showToast: true,
    errorMessage: "레지스트리 보안 레벨 설정 저장에 실패했습니다.",
  },
};
