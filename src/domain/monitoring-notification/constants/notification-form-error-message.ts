// ===== 폼 검증 상수 =====

export const NOTIFICATION_FORM_CONSTRAINTS = {
  notificationSetName: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255,
  },
  nodeName: {
    MIN_COUNT: 1,
  },
  threshold: {
    MIN_COUNT: 1,
  },
} as const;

// ===== 폼 에러 메시지 =====

export const NOTIFICATION_FORM_ERROR_MESSAGES = {
  notificationSetName: {
    too_small: "알림 이름을 입력해 주세요.",
    too_big: `알림 이름은 ${NOTIFICATION_FORM_CONSTRAINTS.notificationSetName.MAX_LENGTH}자 이하여야 합니다.`,
  },
  nodeName: {
    too_small: "노드를 선택해 주세요.",
  },
  threshold: {
    too_small: `최소 ${NOTIFICATION_FORM_CONSTRAINTS.threshold.MIN_COUNT}개의 설정이 필요합니다.`,
  },
  channel: {
    required: "알림 유형을 1개 이상 선택해 주세요.",
  },
} as const;
