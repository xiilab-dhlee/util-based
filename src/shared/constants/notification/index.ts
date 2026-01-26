/**
 * @file 알림 상수 Index
 * @description 알림 관련 상수 Re-export
 */

// Admin 알림
export {
  ADMIN_NOTIFICATION_SECTIONS,
  ADMIN_NOTIFICATION_SET_LABEL,
  ADMIN_NOTIFICATION_SET_NAME,
  ADMIN_NOTIFICATION_TYPE_MAP,
  type AdminNotificationSetName,
  getAdminNotificationSetLabel,
} from "./admin-notification.constant";
// 공통 (카테고리 + 채널 + 읽음 상태 + 정렬 + 탭 + 페이지)
export {
  getHasReadFromTab,
  getNotificationTypeLabel,
  NOTIFICATION_CHANNEL,
  NOTIFICATION_CHANNEL_LABEL,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_HAS_READ_LABEL,
  NOTIFICATION_HAS_READ_OPTIONS,
  NOTIFICATION_PAGE_SIZE,
  NOTIFICATION_SORT_FIELDS,
  NOTIFICATION_TAB,
  NOTIFICATION_TYPE,
  NOTIFICATION_TYPE_LABEL,
  NOTIFICATION_TYPE_OPTIONS,
  type NotificationChannel,
  type NotificationSortField,
  type NotificationTabValue,
  type NotificationTypeValue,
} from "./notification.constant";
// User 알림
export {
  getUserNotificationSetLabel,
  USER_NOTIFICATION_SECTION_ORDER,
  USER_NOTIFICATION_SECTIONS,
  USER_NOTIFICATION_SET_LABEL,
  USER_NOTIFICATION_SET_LABELS,
  USER_NOTIFICATION_SET_NAME,
  USER_NOTIFICATION_TYPE_MAP,
  type UserNotificationSection,
  type UserNotificationSetName,
} from "./user-notification.constant";
