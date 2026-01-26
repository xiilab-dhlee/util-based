/**
 * 프로필 수정 폼 유효성 검사 상수
 */
export const UPDATE_PROFILE_FORM_CONSTANTS = {
  firstName: {
    maxLength: 25,
  },
  lastName: {
    maxLength: 25,
  },
  password: {
    minLength: 8,
    maxLength: 16,
  },
} as const;
