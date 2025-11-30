import type { ErrorConfig } from "@/shared/types/error.type";

/**
 * 계정 관리 도메인 에러 설정
 */
export const accountErrorConfig: Record<string, ErrorConfig> = {
  // GET 요청 (조회) - 토스트 표시 안함
  "account.list": {
    showToast: false,
    errorMessage: "사용자 목록을 불러올 수 없습니다.",
  },
  "account.pendingList": {
    showToast: false,
    errorMessage: "가입 승인 목록을 불러올 수 없습니다.",
  },
  "account.detail": {
    showToast: false,
    errorMessage: "계정 상세 정보를 불러올 수 없습니다.",
  },
  // Mutation 요청 (수정/삭제/검증) - 토스트 표시
  "account.update": {
    showToast: true,
    errorMessage: "계정 정보 수정에 실패했습니다.",
  },
  "account.delete": {
    showToast: true,
    errorMessage: "계정 삭제에 실패했습니다.",
  },
  "account.checkPassword": {
    showToast: true,
    errorMessage: "비밀번호 확인에 실패했습니다.",
  },
};
