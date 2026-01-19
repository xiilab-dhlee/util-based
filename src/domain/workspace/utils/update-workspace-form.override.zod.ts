import { z } from "zod";

import { updateWorkspaceBody } from "@/api/generated/workspace/workspace.zod";
import { CREATE_WORKSPACE_ERROR_MESSAGES } from "@/domain/workspace/constants/create-workspace-form-error-message";
import { WORKSPACE_NAME_PATTERN } from "@/domain/workspace/constants/workspace-validation.constant";

export const updateWorkspaceBodyExtended = updateWorkspaceBody.extend({
  workspaceName: z
    .string({
      required_error: CREATE_WORKSPACE_ERROR_MESSAGES.workspaceName.required,
    })
    .trim()
    .min(1, {
      message: CREATE_WORKSPACE_ERROR_MESSAGES.workspaceName.required,
    })
    .max(50, {
      message: CREATE_WORKSPACE_ERROR_MESSAGES.workspaceName.too_long,
    })
    .regex(WORKSPACE_NAME_PATTERN, {
      message: CREATE_WORKSPACE_ERROR_MESSAGES.workspaceName.invalid_pattern,
    }),
  description: z
    .string()
    .trim()
    .max(1000, {
      message: CREATE_WORKSPACE_ERROR_MESSAGES.description.too_long,
    })
    .optional(),
});
