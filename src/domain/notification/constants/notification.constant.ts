import type { AdminNotificationSetResponseNotificationType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 알림 정렬 필드 배열
 */
export const NOTIFICATION_SORT_FIELDS = ["createDateTime"] as const;

/**
 * 알림 정렬 필드 타입
 */
export type NotificationSortField = (typeof NOTIFICATION_SORT_FIELDS)[number];

/**
 * 알림 유형 (필터용)
 */
export const NOTIFICATION_TYPE = {
  LICENSE: "LICENSE",
  ACCOUNT: "ACCOUNT",
  VULNERABILITY: "VULNERABILITY",
  NODE: "NODE",
  WORKSPACE: "WORKSPACE",
  WORKLOAD: "WORKLOAD",
} as const;

export type NotificationTypeValue =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

/**
 * 알림 유형별 라벨 (필터 드롭다운용)
 */
export const NOTIFICATION_TYPE_LABEL: Record<NotificationTypeValue, string> = {
  [NOTIFICATION_TYPE.LICENSE]: "라이선스",
  [NOTIFICATION_TYPE.ACCOUNT]: "회원",
  [NOTIFICATION_TYPE.VULNERABILITY]: "보안",
  [NOTIFICATION_TYPE.NODE]: "노드",
  [NOTIFICATION_TYPE.WORKSPACE]: "워크스페이스",
  [NOTIFICATION_TYPE.WORKLOAD]: "워크로드",
};

/**
 * 알림 유형 드롭다운 옵션
 */
export const NOTIFICATION_TYPE_OPTIONS = Object.entries(
  NOTIFICATION_TYPE_LABEL,
).map(([value, label]) => ({ value, label }));

/**
 * 알림 읽음 상태별 라벨 (필터 드롭다운용)
 */
export const NOTIFICATION_HAS_READ_LABEL = {
  true: "읽음",
  false: "안읽음",
} as const;

/**
 * 알림 읽음 상태 드롭다운 옵션
 */
export const NOTIFICATION_HAS_READ_OPTIONS = Object.entries(
  NOTIFICATION_HAS_READ_LABEL,
).map(([value, label]) => ({ value, label }));

/**
 * 알림 유형 라벨 조회 함수
 */
export function getNotificationTypeLabel(type: string): string {
  return NOTIFICATION_TYPE_LABEL[type as NotificationTypeValue] ?? "-";
}

/**
 * 관리자 알림 설정명 (API 스펙 기반)
 */
export const ADMIN_NOTIFICATION_SET_NAME = {
  LICENSE_EXPIRY_WARNING: "LICENSE_EXPIRY_WARNING",
  USER_SIGNUP: "USER_SIGNUP",
  VULNERABILITY_IMAGE_REQUEST: "VULNERABILITY_IMAGE_REQUEST",
  NODE_FAILURE: "NODE_FAILURE",
  MIG_APPLIED: "MIG_APPLIED",
  MIG_FAILURE: "MIG_FAILURE",
  WORKSPACE_CREATED: "WORKSPACE_CREATED",
  WORKSPACE_RESOURCE_REQUEST: "WORKSPACE_RESOURCE_REQUEST",
  WORKLOAD_RESOURCE_RECLAIM_RESULT: "WORKLOAD_RESOURCE_RECLAIM_RESULT",
} as const;

export type AdminNotificationSetName =
  (typeof ADMIN_NOTIFICATION_SET_NAME)[keyof typeof ADMIN_NOTIFICATION_SET_NAME];

/**
 * 알림 설정 표시 라벨 (한글)
 */
export const ADMIN_NOTIFICATION_SET_LABEL: Record<
  AdminNotificationSetName,
  string
> = {
  [ADMIN_NOTIFICATION_SET_NAME.LICENSE_EXPIRY_WARNING]:
    "라이선스 만료 경고 알림",
  [ADMIN_NOTIFICATION_SET_NAME.USER_SIGNUP]: "유저 회원",
  [ADMIN_NOTIFICATION_SET_NAME.VULNERABILITY_IMAGE_REQUEST]:
    "취약점 이미지 사용 요청 알림",
  [ADMIN_NOTIFICATION_SET_NAME.NODE_FAILURE]: "노드 장애 알림",
  [ADMIN_NOTIFICATION_SET_NAME.MIG_APPLIED]: "MIG 적용 알림",
  [ADMIN_NOTIFICATION_SET_NAME.MIG_FAILURE]: "MIG 적용 장애 알림",
  [ADMIN_NOTIFICATION_SET_NAME.WORKSPACE_CREATED]: "워크스페이스 생성 알림",
  [ADMIN_NOTIFICATION_SET_NAME.WORKSPACE_RESOURCE_REQUEST]:
    "워크스페이스 리소스 요청 알림",
  [ADMIN_NOTIFICATION_SET_NAME.WORKLOAD_RESOURCE_RECLAIM_RESULT]:
    "리소스 경고 및 회수 알림",
};

/**
 * 알림 설정 라벨 조회 함수
 */
export function getAdminNotificationSetLabel(
  name: AdminNotificationSetName,
): string {
  return ADMIN_NOTIFICATION_SET_LABEL[name] ?? name;
}

/**
 * 알림 카테고리 라벨 (한글)
 */
export const ADMIN_NOTIFICATION_CATEGORY_LABEL: Record<
  AdminNotificationSetResponseNotificationType,
  string
> = {
  LICENSE: "라이선스",
  ACCOUNT: "회원",
  VULNERABILITY: "보안",
  NODE: "노드",
  WORKSPACE: "워크스페이스",
  WORKLOAD: "워크로드",
  MONITORING: "모니터링",
};

/**
 * 알림 설정 섹션 구성 (정적 레이아웃용)
 */
export const ADMIN_NOTIFICATION_SECTIONS: readonly {
  category: AdminNotificationSetResponseNotificationType;
  items: readonly AdminNotificationSetName[];
}[] = [
  {
    category: "LICENSE",
    items: [ADMIN_NOTIFICATION_SET_NAME.LICENSE_EXPIRY_WARNING],
  },
  {
    category: "ACCOUNT",
    items: [ADMIN_NOTIFICATION_SET_NAME.USER_SIGNUP],
  },
  {
    category: "VULNERABILITY",
    items: [ADMIN_NOTIFICATION_SET_NAME.VULNERABILITY_IMAGE_REQUEST],
  },
  {
    category: "NODE",
    items: [
      ADMIN_NOTIFICATION_SET_NAME.NODE_FAILURE,
      ADMIN_NOTIFICATION_SET_NAME.MIG_APPLIED,
      ADMIN_NOTIFICATION_SET_NAME.MIG_FAILURE,
    ],
  },
  {
    category: "WORKSPACE",
    items: [
      ADMIN_NOTIFICATION_SET_NAME.WORKSPACE_CREATED,
      ADMIN_NOTIFICATION_SET_NAME.WORKSPACE_RESOURCE_REQUEST,
    ],
  },
  {
    category: "WORKLOAD",
    items: [ADMIN_NOTIFICATION_SET_NAME.WORKLOAD_RESOURCE_RECLAIM_RESULT],
  },
];
