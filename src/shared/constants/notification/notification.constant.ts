/**
 * @file 알림 공통 상수
 * @description 카테고리, 채널 등 공통으로 사용되는 알림 상수
 */

import type { AdminNotificationSetResponseNotificationType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

// ===== 알림 카테고리 (타입) =====

/**
 * 알림 카테고리 (필터용)
 */
export const NOTIFICATION_TYPE = {
  LICENSE: "LICENSE",
  ACCOUNT: "ACCOUNT",
  VULNERABILITY: "VULNERABILITY",
  NODE: "NODE",
  WORKSPACE: "WORKSPACE",
  WORKLOAD: "WORKLOAD",
} as const satisfies Record<
  string,
  AdminNotificationSetResponseNotificationType
>;

export type NotificationTypeValue =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

/**
 * 알림 카테고리 라벨 (한글)
 */
export const NOTIFICATION_TYPE_LABEL: Record<NotificationTypeValue, string> = {
  [NOTIFICATION_TYPE.LICENSE]: "라이선스",
  [NOTIFICATION_TYPE.ACCOUNT]: "회원",
  [NOTIFICATION_TYPE.VULNERABILITY]: "보안",
  [NOTIFICATION_TYPE.NODE]: "노드",
  [NOTIFICATION_TYPE.WORKSPACE]: "워크스페이스",
  [NOTIFICATION_TYPE.WORKLOAD]: "워크로드",
};

const NOTIFICATION_TYPE_VALUES = Object.values(NOTIFICATION_TYPE);

export function isNotificationTypeValue(
  value: string,
): value is NotificationTypeValue {
  return NOTIFICATION_TYPE_VALUES.some((type) => type === value);
}

/**
 * 알림 카테고리 드롭다운 옵션
 */
export const NOTIFICATION_TYPE_OPTIONS = (
  Object.entries(NOTIFICATION_TYPE_LABEL) as [NotificationTypeValue, string][]
).map(([value, label]) => ({ value, label })) satisfies readonly {
  value: NotificationTypeValue;
  label: string;
}[];

/**
 * 알림 카테고리 라벨 조회
 */
export function getNotificationTypeLabel(
  type: NotificationTypeValue | string,
): string {
  if (!isNotificationTypeValue(type)) {
    return "-";
  }

  return NOTIFICATION_TYPE_LABEL[type];
}

// ===== 알림 채널 =====

/**
 * 알림 채널
 */
export const NOTIFICATION_CHANNEL = {
  SYSTEM: "SYSTEM",
  EMAIL: "EMAIL",
} as const;

export type NotificationChannel =
  (typeof NOTIFICATION_CHANNEL)[keyof typeof NOTIFICATION_CHANNEL];

export const NOTIFICATION_CHANNELS = Object.values(NOTIFICATION_CHANNEL);

/**
 * 알림 채널 라벨
 */
export const NOTIFICATION_CHANNEL_LABEL: Record<NotificationChannel, string> = {
  [NOTIFICATION_CHANNEL.EMAIL]: "E-mail",
  [NOTIFICATION_CHANNEL.SYSTEM]: "System",
};

// ===== 정렬 필드 =====

/**
 * 알림 정렬 필드
 */
export const NOTIFICATION_SORT_FIELDS = ["createdAt"] as const;

export type NotificationSortField = (typeof NOTIFICATION_SORT_FIELDS)[number];

export const NOTIFICATION_HAS_READ_LABEL = {
  true: "읽음",
  false: "안읽음",
} as const;

export const NOTIFICATION_HAS_READ_OPTIONS = [
  { value: "true", label: NOTIFICATION_HAS_READ_LABEL.true },
  { value: "false", label: NOTIFICATION_HAS_READ_LABEL.false },
] as const satisfies readonly {
  value: "true" | "false";
  label: string;
}[];

export const NOTIFICATION_TAB = {
  ALL: "ALL",
  UNREAD: "UNREAD",
} as const;

export type NotificationTabValue =
  (typeof NOTIFICATION_TAB)[keyof typeof NOTIFICATION_TAB];

export function getHasReadFromTab(
  tab: NotificationTabValue,
): boolean | undefined {
  return tab === NOTIFICATION_TAB.UNREAD ? false : undefined;
}

export const NOTIFICATION_PAGE_SIZE = 10;

/** 알림 폴링 주기 (3분) */
export const NOTIFICATION_POLLING_INTERVAL = 3 * 60 * 1000;
