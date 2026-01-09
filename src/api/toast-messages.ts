import { MUTATION_KEYS, type MutationKey } from "./generated/mutation-keys";

/**
 * Mutation Toast Messages Registry
 *
 * Orval이 생성한 mutationKey와 타입 안전하게 매칭되는 토스트 메시지
 *
 * 성공 메시지: 프론트엔드 정의 (사용자 확인 메시지)
 * 에러 메시지: 백엔드 제공 (API 응답에서)
 */
export const MUTATION_MESSAGES: Partial<
  Record<MutationKey, { success?: string }>
> = {
  // ============================================
  // Account Management (Admin)
  // ============================================
  [MUTATION_KEYS.updateAccount]: {
    success: "계정 정보가 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteAccount]: {
    success: "계정이 삭제되었습니다.",
  },
  [MUTATION_KEYS.updateAccountEnabled]: {
    success: "계정 상태가 변경되었습니다.",
  },
  [MUTATION_KEYS.approveSignupRequests]: {
    success: "가입이 승인되었습니다.",
  },
  [MUTATION_KEYS.rejectSignupRequests]: {
    success: "가입을 반려했습니다.",
  },

  // ============================================
  // Account (User)
  // ============================================
  [MUTATION_KEYS.pinWorkspace]: {
    success: "워크스페이스가 고정되었습니다.",
  },
  [MUTATION_KEYS.unpinWorkspace]: {
    success: "워크스페이스 고정이 해제되었습니다.",
  },

  // ============================================
  // Workspace
  // ============================================
  [MUTATION_KEYS.createWorkspace]: {
    success: "워크스페이스가 생성되었습니다.",
  },
};
