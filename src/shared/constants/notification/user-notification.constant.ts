/**
 * @file User 역할 알림 상수
 * @description USER 역할에게 표시되는 알림 상수 (7개)
 */

import { NotificationSetResponseNotificationType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  NOTIFICATION_TYPE,
  type NotificationTypeValue,
} from "./notification.constant";

// ===== User 알림 설정명 =====

/**
 * User 알림 설정명 (7개)
 */
export const USER_NOTIFICATION_SET_NAME = {
  // WORKSPACE (1)
  WORKSPACE_RESOURCE_REQUEST_RESULT: "WORKSPACE_RESOURCE_REQUEST_RESULT",

  // WORKLOAD (6)
  BATCH_JOB_COMPLETED: "BATCH_JOB_COMPLETED",
  JOB_RECLAIM_WARNING: "JOB_RECLAIM_WARNING",
  JOB_RECLAIMED: "JOB_RECLAIMED",
  IMAGE_COMMIT_REGISTERED: "IMAGE_COMMIT_REGISTERED",
  WORKLOAD_STARTED: "WORKLOAD_STARTED",
  WORKLOAD_ERROR: "WORKLOAD_ERROR",
} as const;

export type UserNotificationSetName =
  (typeof USER_NOTIFICATION_SET_NAME)[keyof typeof USER_NOTIFICATION_SET_NAME];

// ===== User 알림 라벨 =====

/**
 * User 알림 설정 라벨 (한글)
 */
export const USER_NOTIFICATION_SET_LABEL: Record<
  UserNotificationSetName,
  string
> = {
  [USER_NOTIFICATION_SET_NAME.WORKSPACE_RESOURCE_REQUEST_RESULT]:
    "워크스페이스 리소스 요청 결과 알림",
  [USER_NOTIFICATION_SET_NAME.BATCH_JOB_COMPLETED]: "Batch Job 종료 알림",
  [USER_NOTIFICATION_SET_NAME.JOB_RECLAIM_WARNING]: "Job 회수 경고 알림",
  [USER_NOTIFICATION_SET_NAME.JOB_RECLAIMED]: "Job 회수 완료 알림",
  [USER_NOTIFICATION_SET_NAME.IMAGE_COMMIT_REGISTERED]:
    "Snapshot Image 등록 알림",
  [USER_NOTIFICATION_SET_NAME.WORKLOAD_STARTED]: "워크로드 실행 알림",
  [USER_NOTIFICATION_SET_NAME.WORKLOAD_ERROR]: "워크로드 에러 알림",
};

/**
 * User 알림 설정 라벨 조회
 */
export function getUserNotificationSetLabel(name: string): string {
  return USER_NOTIFICATION_SET_LABEL[name as UserNotificationSetName] ?? name;
}

// ===== User 알림 → 카테고리 매핑 =====

/**
 * User 알림 → 카테고리 매핑
 */
export const USER_NOTIFICATION_TYPE_MAP: Record<
  UserNotificationSetName,
  NotificationTypeValue
> = {
  [USER_NOTIFICATION_SET_NAME.WORKSPACE_RESOURCE_REQUEST_RESULT]:
    NOTIFICATION_TYPE.WORKSPACE,
  [USER_NOTIFICATION_SET_NAME.BATCH_JOB_COMPLETED]: NOTIFICATION_TYPE.WORKLOAD,
  [USER_NOTIFICATION_SET_NAME.JOB_RECLAIM_WARNING]: NOTIFICATION_TYPE.WORKLOAD,
  [USER_NOTIFICATION_SET_NAME.JOB_RECLAIMED]: NOTIFICATION_TYPE.WORKLOAD,
  [USER_NOTIFICATION_SET_NAME.IMAGE_COMMIT_REGISTERED]:
    NOTIFICATION_TYPE.WORKLOAD,
  [USER_NOTIFICATION_SET_NAME.WORKLOAD_STARTED]: NOTIFICATION_TYPE.WORKLOAD,
  [USER_NOTIFICATION_SET_NAME.WORKLOAD_ERROR]: NOTIFICATION_TYPE.WORKLOAD,
};

// ===== User 알림 섹션 구성 =====

/**
 * User 알림 설정 UI 섹션 구성
 */
export const USER_NOTIFICATION_SECTIONS: readonly {
  category: NotificationSetResponseNotificationType;
  label: string;
  items: readonly UserNotificationSetName[];
}[] = [
  {
    category: NotificationSetResponseNotificationType.WORKSPACE,
    label: "워크스페이스",
    items: [USER_NOTIFICATION_SET_NAME.WORKSPACE_RESOURCE_REQUEST_RESULT],
  },
  {
    category: NotificationSetResponseNotificationType.WORKLOAD,
    label: "워크로드",
    items: [
      USER_NOTIFICATION_SET_NAME.BATCH_JOB_COMPLETED,
      USER_NOTIFICATION_SET_NAME.JOB_RECLAIM_WARNING,
      USER_NOTIFICATION_SET_NAME.JOB_RECLAIMED,
      USER_NOTIFICATION_SET_NAME.IMAGE_COMMIT_REGISTERED,
      USER_NOTIFICATION_SET_NAME.WORKLOAD_STARTED,
      USER_NOTIFICATION_SET_NAME.WORKLOAD_ERROR,
    ],
  },
];

/**
 * User 알림 섹션 표시 순서
 */
export const USER_NOTIFICATION_SECTION_ORDER = [
  NotificationSetResponseNotificationType.WORKSPACE,
  NotificationSetResponseNotificationType.WORKLOAD,
] as const;

export type UserNotificationSection =
  (typeof USER_NOTIFICATION_SECTION_ORDER)[number];

// ===== Setting 컴포넌트 호환 =====

/**
 * User 알림 설정 라벨 (Setting 컴포넌트 호환)
 * @description NOTIFICATION_SET_LABELS 형식 - label과 section 포함
 */
export const USER_NOTIFICATION_SET_LABELS: Record<
  UserNotificationSetName,
  { label: string; section: UserNotificationSection }
> = {
  [USER_NOTIFICATION_SET_NAME.WORKSPACE_RESOURCE_REQUEST_RESULT]: {
    label: "워크스페이스 리소스 요청 결과 알림",
    section: NotificationSetResponseNotificationType.WORKSPACE,
  },
  [USER_NOTIFICATION_SET_NAME.BATCH_JOB_COMPLETED]: {
    label: "Batch Job 종료 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  [USER_NOTIFICATION_SET_NAME.JOB_RECLAIM_WARNING]: {
    label: "Job 회수 경고 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  [USER_NOTIFICATION_SET_NAME.JOB_RECLAIMED]: {
    label: "Job 회수 완료 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  [USER_NOTIFICATION_SET_NAME.IMAGE_COMMIT_REGISTERED]: {
    label: "Snapshot Image 등록 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  [USER_NOTIFICATION_SET_NAME.WORKLOAD_STARTED]: {
    label: "워크로드 실행 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  [USER_NOTIFICATION_SET_NAME.WORKLOAD_ERROR]: {
    label: "워크로드 에러 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
};
