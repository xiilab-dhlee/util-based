import {
  type NotificationSetResponseNotificationSetName,
  NotificationSetResponseNotificationType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

// 알림 채널 타입
export const NOTIFICATION_CHANNELS = ["SYSTEM", "EMAIL"] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_SET_LABELS: Partial<
  Record<
    NotificationSetResponseNotificationSetName,
    {
      label: string;
      section: NotificationSection;
    }
  >
> = {
  WORKSPACE_RESOURCE_REQUEST_RESULT: {
    label: "워크스페이스 리소스 요청 결과 알림",
    section: NotificationSetResponseNotificationType.WORKSPACE,
  },
  BATCH_JOB_COMPLETED: {
    label: "Batch Job 종료 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  JOB_RECLAIM_WARNING: {
    label: "Job 회수 경고 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  JOB_RECLAIMED: {
    label: "Job 회수 완료 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  IMAGE_COMMIT_REGISTERED: {
    label: "Snapshot Image 등록 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  WORKLOAD_STARTED: {
    label: "워크로드 실행 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
  WORKLOAD_ERROR: {
    label: "워크로드 에러 알림",
    section: NotificationSetResponseNotificationType.WORKLOAD,
  },
};

export const SECTION_ORDER = [
  NotificationSetResponseNotificationType.WORKSPACE,
  NotificationSetResponseNotificationType.WORKLOAD,
] as const;

export type NotificationSection = (typeof SECTION_ORDER)[number];
