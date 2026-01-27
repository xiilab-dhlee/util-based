import { z } from "zod";

import { WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES } from "@/domain/system-setting/constants/workspace-resource-setting-form-error-message";

/**
 * MIG 리소스 스키마
 */
export const migResourceSchema = z.object({
  profile: z.string().min(1, {
    message:
      WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.migResources.profile
        .required,
  }),
  count: z
    .string()
    .min(1, {
      message:
        WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.migResources.count
          .required,
    })
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 1;
      },
      {
        message:
          WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.migResources.count
            .too_small,
      },
    ),
});

/**
 * 워크스페이스 리소스 설정 폼 스키마
 */
export const workspaceResourceSettingFormSchemaExtended = z.object({
  gpu: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || value === "") return true;
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 0;
      },
      {
        message: WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.gpu.too_small,
      },
    ),
  cpu: z
    .string()
    .min(1, {
      message: WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.cpu.required,
    })
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 1;
      },
      {
        message: WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.cpu.too_small,
      },
    ),
  memory: z
    .string()
    .min(1, {
      message: WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.memory.required,
    })
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 1;
      },
      {
        message:
          WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.memory.too_small,
      },
    ),
  workspaceCount: z
    .string()
    .min(1, {
      message:
        WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.workspaceCount.required,
    })
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 1;
      },
      {
        message:
          WORKSPACE_RESOURCE_SETTING_FORM_ERROR_MESSAGES.workspaceCount
            .too_small,
      },
    ),
  migResources: z.array(migResourceSchema).optional(),
});

export type WorkspaceResourceSettingFormTypeExtended = z.infer<
  typeof workspaceResourceSettingFormSchemaExtended
>;

export type MigResourceTypeExtended = z.infer<typeof migResourceSchema>;
