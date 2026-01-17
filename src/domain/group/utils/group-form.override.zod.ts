import { z } from "zod";

import {
  createGroupBody,
  updateGroupBody,
} from "@/api/generated/admin-group/admin-group.zod";
import { GROUP_FORM_ERROR_MESSAGES } from "@/domain/group/constants/group-form-error-message";
import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_NAME_MAX_LENGTH,
  GROUP_NAME_PATTERN,
} from "@/domain/group/constants/group-validation.constant";

export const createGroupBodyExtended = createGroupBody.extend({
  groupName: z
    .string({
      required_error: GROUP_FORM_ERROR_MESSAGES.groupName.required,
    })
    .trim()
    .min(1, {
      message: GROUP_FORM_ERROR_MESSAGES.groupName.required,
    })
    .max(GROUP_NAME_MAX_LENGTH, {
      message: GROUP_FORM_ERROR_MESSAGES.groupName.too_long,
    })
    .regex(GROUP_NAME_PATTERN, {
      message: GROUP_FORM_ERROR_MESSAGES.groupName.invalid_pattern,
    }),
  description: z
    .string()
    .max(GROUP_DESCRIPTION_MAX_LENGTH, {
      message: GROUP_FORM_ERROR_MESSAGES.description.too_long,
    })
    .optional(),
});

export const updateGroupBodyExtended = updateGroupBody.extend({
  groupName: z
    .string({
      required_error: GROUP_FORM_ERROR_MESSAGES.groupName.required,
    })
    .trim()
    .min(1, {
      message: GROUP_FORM_ERROR_MESSAGES.groupName.required,
    })
    .max(GROUP_NAME_MAX_LENGTH, {
      message: GROUP_FORM_ERROR_MESSAGES.groupName.too_long,
    })
    .regex(GROUP_NAME_PATTERN, {
      message: GROUP_FORM_ERROR_MESSAGES.groupName.invalid_pattern,
    }),
  description: z
    .string()
    .max(GROUP_DESCRIPTION_MAX_LENGTH, {
      message: GROUP_FORM_ERROR_MESSAGES.description.too_long,
    })
    .optional(),
});
