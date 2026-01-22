import type { NotificationSetResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  USER_NOTIFICATION_SECTION_ORDER,
  USER_NOTIFICATION_SET_LABELS,
  type UserNotificationSection,
  type UserNotificationSetName,
} from "@/shared/constants/notification";

function isUserNotificationSetName(
  name: string,
): name is UserNotificationSetName {
  return Object.hasOwn(USER_NOTIFICATION_SET_LABELS, name);
}

export function getNotificationSetLabel(name: string): string | null {
  if (!isUserNotificationSetName(name)) return null;
  return USER_NOTIFICATION_SET_LABELS[name].label;
}

export function groupNotificationSetsBySection(
  notificationSets: NotificationSetResponse[],
): Map<UserNotificationSection, NotificationSetResponse[]> {
  const grouped = new Map<UserNotificationSection, NotificationSetResponse[]>();
  USER_NOTIFICATION_SECTION_ORDER.forEach((section) => {
    grouped.set(section, []);
  });

  notificationSets.forEach((notificationSet) => {
    const { notificationSetName } = notificationSet;
    if (!isUserNotificationSetName(notificationSetName)) return;

    const mapped = USER_NOTIFICATION_SET_LABELS[notificationSetName];
    const bucket = grouped.get(mapped.section);
    if (bucket) bucket.push(notificationSet);
  });

  return grouped;
}
