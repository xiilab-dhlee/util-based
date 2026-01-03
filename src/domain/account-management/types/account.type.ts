// ============================================
// OpenAPI에 없는 타입
// ============================================

/** 비밀번호 재확인 (OpenAPI에 없는 기능) */
export interface CheckPasswordPayload {
  accountname: string;
  password: string;
}
