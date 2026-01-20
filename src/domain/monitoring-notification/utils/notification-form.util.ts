import { isString } from "es-toolkit/predicate";
import type { z } from "zod";

import { NOTIFICATION_FORM_ERROR_MESSAGES } from "@/domain/monitoring-notification/constants/notification-form-error-message";

export const notificationFormErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const firstPathSegment = issue.path[0];
  if (!isString(firstPathSegment)) {
    return { message: ctx.defaultError };
  }

  switch (firstPathSegment) {
    case "notificationSetName":
      if (issue.code === "too_small") {
        return {
          message:
            NOTIFICATION_FORM_ERROR_MESSAGES.notificationSetName.too_small,
        };
      }
      if (issue.code === "too_big") {
        return {
          message: NOTIFICATION_FORM_ERROR_MESSAGES.notificationSetName.too_big,
        };
      }
      return { message: ctx.defaultError };

    case "nodeName":
      if (issue.code === "too_small") {
        return {
          message: NOTIFICATION_FORM_ERROR_MESSAGES.nodeName.too_small,
        };
      }
      return { message: ctx.defaultError };

    case "threshold":
      if (issue.code === "too_small") {
        return {
          message: NOTIFICATION_FORM_ERROR_MESSAGES.threshold.too_small,
        };
      }
      return { message: ctx.defaultError };

    default:
      return { message: ctx.defaultError };
  }
};
