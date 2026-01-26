export const REJECT_REASON_MAX_LENGTH = 1000;
export const REJECT_REQUEST_RESOURCE_FORM_ERROR_MESSAGES = {
  rejectReason: {
    too_small: "리소스 요청 반려 사유를 입력해 주세요.",
    too_big: `반려 사유는 ${REJECT_REASON_MAX_LENGTH}자를 초과할 수 없습니다.`,
    invalid_type: "반려 사유는 텍스트여야 합니다.",
  },
} as const;
