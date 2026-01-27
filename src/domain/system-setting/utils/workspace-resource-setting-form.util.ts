import { isString } from "es-toolkit/predicate";
import type { z } from "zod";

import { WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES } from "@/domain/system-setting/constants/workspace-resource-setting-form-error-message";

export const workspaceResourceSettingErrorMap: z.ZodErrorMap = (issue, ctx) => {
  const firstPathSegment = issue.path[0];
  if (!isString(firstPathSegment)) {
    return { message: ctx.defaultError };
  }

  switch (firstPathSegment) {
    case "gpu":
      if (issue.code === "too_small") {
        return {
          message: WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.gpu.too_small,
        };
      }
      if (issue.code === "too_big") {
        return {
          message: WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.gpu.too_big,
        };
      }
      return {
        message:
          WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.gpu.invalid_type,
      };

    case "cpu":
      if (issue.code === "too_small") {
        return {
          message: WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.cpu.too_small,
        };
      }
      if (issue.code === "too_big") {
        return {
          message: WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.cpu.too_big,
        };
      }
      return {
        message:
          WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.cpu.invalid_type,
      };

    case "memory":
      if (issue.code === "too_small") {
        return {
          message:
            WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.memory.too_small,
        };
      }
      if (issue.code === "too_big") {
        return {
          message:
            WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.memory.too_big,
        };
      }
      return {
        message:
          WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.memory.invalid_type,
      };

    case "workspaceCount":
      if (issue.code === "too_small") {
        return {
          message:
            WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.workspaceCount
              .too_small,
        };
      }
      return {
        message:
          WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.workspaceCount
            .invalid_type,
      };

    case "migResources":
      return { message: ctx.defaultError };

    default:
      return { message: ctx.defaultError };
  }
};
