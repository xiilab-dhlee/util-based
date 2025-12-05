/**
 * 알림 유형 상수
 */
export const NOTIFICATION_TYPE = {
  /** 라이선스 만료 경고 */
  LICENSE_EXPIRE: "LICENSE_EXPIRE",
  /** 유저 회원가입 */
  MEMBER_SIGNUP: "MEMBER_SIGNUP",
  /** 회원 승인 요청 */
  MEMBER_APPROVAL: "MEMBER_APPROVAL",
  /** 취약점 이미지 사용 요청 */
  VULNERABLE_IMAGE: "VULNERABLE_IMAGE",
  /** 노드 장애 */
  NODE_FAIL: "NODE_FAIL",
  /** MIG 적용 */
  MIG_APPLY: "MIG_APPLY",
  /** MIG 장애 */
  MIG_FAIL: "MIG_FAIL",
  /** 워크스페이스 생성 */
  WORKSPACE_CREATE: "WORKSPACE_CREATE",
  /** 워크스페이스 리소스 초과 */
  WORKSPACE_RESOURCE_EXCEED: "WORKSPACE_RESOURCE_EXCEED",
  /** 워크스페이스 리소스 요청 */
  WORKSPACE_RESOURCE_REQUEST: "WORKSPACE_RESOURCE_REQUEST",
  /** 리소스 경고 */
  RESOURCE_WARNING: "RESOURCE_WARNING",
  /** 리소스 회수 */
  RESOURCE_RECOVERY: "RESOURCE_RECOVERY",
} as const;

export type NotificationTypeKey = keyof typeof NOTIFICATION_TYPE;
export type NotificationTypeValue =
  (typeof NOTIFICATION_TYPE)[NotificationTypeKey];

/**
 * 알림 유형별 라벨 (한글)
 */
export const NOTIFICATION_TYPE_LABEL: Record<NotificationTypeValue, string> = {
  [NOTIFICATION_TYPE.LICENSE_EXPIRE]: "라이선스 만료 경고 알림",
  [NOTIFICATION_TYPE.MEMBER_SIGNUP]: "유저 회원가입 알림",
  [NOTIFICATION_TYPE.MEMBER_APPROVAL]: "회원 승인 요청 알림",
  [NOTIFICATION_TYPE.VULNERABLE_IMAGE]: "취약점 이미지 사용 요청 알림",
  [NOTIFICATION_TYPE.NODE_FAIL]: "노드 장애 알림",
  [NOTIFICATION_TYPE.MIG_APPLY]: "MIG 적용 알림",
  [NOTIFICATION_TYPE.MIG_FAIL]: "MIG 장애 알림",
  [NOTIFICATION_TYPE.WORKSPACE_CREATE]: "워크스페이스 생성 알림",
  [NOTIFICATION_TYPE.WORKSPACE_RESOURCE_EXCEED]:
    "워크스페이스 리소스 초과 알림",
  [NOTIFICATION_TYPE.WORKSPACE_RESOURCE_REQUEST]:
    "워크스페이스 리소스 요청 알림",
  [NOTIFICATION_TYPE.RESOURCE_WARNING]: "리소스 경고 알림",
  [NOTIFICATION_TYPE.RESOURCE_RECOVERY]: "리소스 회수 알림",
};

/**
 * 알림 유형 라벨 조회 함수
 */
export const getNotificationTypeLabel = (
  type: NotificationTypeValue,
): string => {
  return NOTIFICATION_TYPE_LABEL[type];
};

/**
 * 알림 카테고리 (섹션 그룹핑용)
 */
export const NOTIFICATION_CATEGORY = {
  LICENSE: "LICENSE",
  MEMBER: "MEMBER",
  SECURITY: "SECURITY",
  NODE: "NODE",
  WORKSPACE: "WORKSPACE",
  WORKLOAD: "WORKLOAD",
} as const;

export type NotificationCategoryKey = keyof typeof NOTIFICATION_CATEGORY;
export type NotificationCategoryValue =
  (typeof NOTIFICATION_CATEGORY)[NotificationCategoryKey];

/**
 * 알림 카테고리별 라벨
 */
export const NOTIFICATION_CATEGORY_LABEL: Record<
  NotificationCategoryValue,
  string
> = {
  [NOTIFICATION_CATEGORY.LICENSE]: "라이선스",
  [NOTIFICATION_CATEGORY.MEMBER]: "회원",
  [NOTIFICATION_CATEGORY.SECURITY]: "보안",
  [NOTIFICATION_CATEGORY.NODE]: "노드",
  [NOTIFICATION_CATEGORY.WORKSPACE]: "워크스페이스",
  [NOTIFICATION_CATEGORY.WORKLOAD]: "워크로드",
};

/**
 * 카테고리별 알림 유형 매핑
 */
export const NOTIFICATION_TYPE_BY_CATEGORY: Record<
  NotificationCategoryValue,
  NotificationTypeValue[]
> = {
  [NOTIFICATION_CATEGORY.LICENSE]: [NOTIFICATION_TYPE.LICENSE_EXPIRE],
  [NOTIFICATION_CATEGORY.MEMBER]: [
    NOTIFICATION_TYPE.MEMBER_SIGNUP,
    NOTIFICATION_TYPE.MEMBER_APPROVAL,
  ],
  [NOTIFICATION_CATEGORY.SECURITY]: [NOTIFICATION_TYPE.VULNERABLE_IMAGE],
  [NOTIFICATION_CATEGORY.NODE]: [
    NOTIFICATION_TYPE.NODE_FAIL,
    NOTIFICATION_TYPE.MIG_APPLY,
    NOTIFICATION_TYPE.MIG_FAIL,
  ],
  [NOTIFICATION_CATEGORY.WORKSPACE]: [
    NOTIFICATION_TYPE.WORKSPACE_CREATE,
    NOTIFICATION_TYPE.WORKSPACE_RESOURCE_EXCEED,
    NOTIFICATION_TYPE.WORKSPACE_RESOURCE_REQUEST,
  ],
  [NOTIFICATION_CATEGORY.WORKLOAD]: [
    NOTIFICATION_TYPE.RESOURCE_WARNING,
    NOTIFICATION_TYPE.RESOURCE_RECOVERY,
  ],
};

/**
 * 알림 유형 드롭다운 옵션
 */
export const NOTIFICATION_TYPE_OPTIONS = (
  Object.entries(NOTIFICATION_TYPE_LABEL) as [NotificationTypeValue, string][]
).map(([value, label]) => ({ value, label }));
