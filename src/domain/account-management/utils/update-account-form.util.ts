import type { z } from "zod";

import { ACCOUNT_UPDATE_FORM_ERROR_MESSAGES } from "@/domain/account-management/constants/update-account-form-error-message";

export const updateAccountErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const fieldName = issue.path[0] as string | undefined;

  switch (fieldName) {
    case "accountRole":
      if (issue.code === "invalid_enum_value") {
        return {
          message:
            ACCOUNT_UPDATE_FORM_ERROR_MESSAGES.accountRole.invalid_enum_value,
        };
      }
      return {
        message: ACCOUNT_UPDATE_FORM_ERROR_MESSAGES.accountRole.invalid_type,
      };

    case "workspaceLimitCount":
      if (issue.code === "too_small") {
        return {
          message:
            ACCOUNT_UPDATE_FORM_ERROR_MESSAGES.workspaceLimitCount.too_small,
        };
      }
      return {
        message:
          ACCOUNT_UPDATE_FORM_ERROR_MESSAGES.workspaceLimitCount.invalid_type,
      };

    case "isEnabled":
      return {
        message: ACCOUNT_UPDATE_FORM_ERROR_MESSAGES.isEnabled.invalid_type,
      };

    default:
      return { message: ctx.defaultError };
  }
};
