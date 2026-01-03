import { MUTATION_KEYS, type MutationKey } from "./generated/mutation-keys";

/**
 * Mutation Toast Messages Registry
 *
 * Orval이 생성한 mutationKey와 타입 안전하게 매칭되는 토스트 메시지
 */
export const MUTATION_MESSAGES: Partial<
  Record<MutationKey, { success?: string; error?: string }>
> = {
  // ============================================
  // Account Management
  // ============================================
  [MUTATION_KEYS.updateAccount]: {
    success: "계정 정보가 수정되었습니다.",
    error: "계정 정보 수정에 실패했습니다.",
  },
  [MUTATION_KEYS.deleteAccount]: {
    success: "계정이 삭제되었습니다.",
    error: "계정 삭제에 실패했습니다.",
  },
  [MUTATION_KEYS.updateAccountEnabled]: {
    success: "계정 상태가 변경되었습니다.",
    error: "계정 상태 변경에 실패했습니다.",
  },
  [MUTATION_KEYS.approveSignupRequests]: {
    success: "가입이 승인되었습니다.",
    error: "가입 승인에 실패했습니다.",
  },
  [MUTATION_KEYS.rejectSignupRequests]: {
    success: "가입을 반려했습니다.",
    error: "가입 반려에 실패했습니다.",
  },
  [MUTATION_KEYS.resetPasswordByAdmin]: {
    success: "비밀번호가 재설정되었습니다.",
    error: "비밀번호 재설정에 실패했습니다.",
  },
};
