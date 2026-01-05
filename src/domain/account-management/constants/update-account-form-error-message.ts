export const ACCOUNT_UPDATE_FORM_ERROR_MESSAGES = {
  accountRole: {
    invalid_enum_value: "권한을 선택해 주세요.",
    invalid_type: "권한 값이 올바르지 않습니다.",
  },
  isEnabled: {
    invalid_type: "상태 값이 올바르지 않습니다.",
  },
  workspaceLimitCount: {
    invalid_type: "워크스페이스 생성 제한 개수는 숫자여야 합니다.",
    too_small: "워크스페이스 생성 제한 개수는 1 이상이어야 합니다.",
  },
} as const;
