import { isString } from "es-toolkit/predicate";
import type { z } from "zod";

import { GROUP_FORM_ERROR_MESSAGES } from "@/domain/group/constants/group-form-error-message";

export const groupFormErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const firstPathSegment = issue.path[0];
  if (!isString(firstPathSegment)) {
    return { message: ctx.defaultError };
  }

  switch (firstPathSegment) {
    case "groupName":
      if (issue.code === "too_small") {
        return { message: GROUP_FORM_ERROR_MESSAGES.groupName.required };
      }
      if (issue.code === "too_big") {
        return { message: GROUP_FORM_ERROR_MESSAGES.groupName.too_long };
      }
      if (issue.code === "invalid_string" && issue.validation === "regex") {
        return { message: GROUP_FORM_ERROR_MESSAGES.groupName.invalid_pattern };
      }
      return { message: GROUP_FORM_ERROR_MESSAGES.groupName.invalid_type };

    case "description":
      if (issue.code === "too_big") {
        return { message: GROUP_FORM_ERROR_MESSAGES.description.too_long };
      }
      return { message: GROUP_FORM_ERROR_MESSAGES.description.invalid_type };

    case "parentGroupId":
      return { message: GROUP_FORM_ERROR_MESSAGES.parentGroupId.invalid_type };

    case "accountId":
      return { message: GROUP_FORM_ERROR_MESSAGES.accountId.invalid_type };

    default:
      return { message: ctx.defaultError };
  }
};
