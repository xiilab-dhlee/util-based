import type {
  NotificationSetResponse,
  NotificationSetResponseNotificationSetName,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  NOTIFICATION_SET_LABELS,
  type NotificationSection,
  SECTION_ORDER,
} from "@/domain/setting/constants/notification-setting.constant";

export function getNotificationSetLabel(
  name: NotificationSetResponseNotificationSetName,
): string | null {
  return NOTIFICATION_SET_LABELS[name]?.label ?? null;
}

export function groupNotificationSetsBySection(
  notificationSets: NotificationSetResponse[],
): Map<NotificationSection, NotificationSetResponse[]> {
  const grouped = new Map<NotificationSection, NotificationSetResponse[]>();
  SECTION_ORDER.forEach((section) => {
    grouped.set(section, []);
  });

  notificationSets.forEach((notificationSet) => {
    const mapped = NOTIFICATION_SET_LABELS[notificationSet.notificationSetName];
    if (!mapped) return;
    const bucket = grouped.get(mapped.section);
    if (bucket) bucket.push(notificationSet);
  });

  return grouped;
}
