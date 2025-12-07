import type { NotificationTypeValue } from "@/domain/notification/constants/notification.constant";
import type { CorePayload } from "@/shared/types/api.interface";

export interface GetNotificationsPayload extends CorePayload {
  type?: NotificationTypeValue;
}

export interface CreateNotificationPayload extends CorePayload {}

export interface UpdateNotificationPayload extends CorePayload {}
