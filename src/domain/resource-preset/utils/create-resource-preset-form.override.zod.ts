import { z } from "zod";

import {
  ResourcePresetCreateRequestNodeType as NodeType,
  PresetGpuRequestGpuType,
  ResourcePresetCreateRequestWorkloadJobType as WorkloadJobType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { CREATE_RESOURCE_PRESET_FORM_CONSTANTS } from "@/domain/resource-preset/constants/create-resource-preset-form.constant";
import { CREATE_RESOURCE_PRESET_FORM_ERROR_MESSAGES } from "@/domain/resource-preset/constants/create-resource-preset-form-error-message";

const { presetName, description, resource } =
  CREATE_RESOURCE_PRESET_FORM_ERROR_MESSAGES;
const { presetName: presetNameConstants, description: descriptionConstants } =
  CREATE_RESOURCE_PRESET_FORM_CONSTANTS;

/**
 * 리소스 프리셋 생성 폼 확장 스키마
 *
 * Orval 생성 스키마의 resource 필드는 min(1) 제약이 있으나,
 * 폼에서는 각 리소스가 0도 허용되어야 함 (단, 최소 1개는 > 0)
 *
 * 따라서 resource 스키마를 재정의하여 min(0)으로 변경
 */
export const createPresetBodyExtended = z
  .object({
    presetName: z
      .string({ required_error: presetName.required })
      .min(1, { message: presetName.required })
      .max(presetNameConstants.maxLength, { message: presetName.too_long }),
    description: z
      .string()
      .max(descriptionConstants.maxLength, { message: description.too_long })
      .optional(),
    resource: z.object({
      cpu: z.object({
        requestCore: z.number().min(0), // 0 허용
      }),
      memory: z.object({
        requestByte: z.number().min(0), // 0 허용
      }),
      gpu: z
        .object({
          gpuType: z.nativeEnum(PresetGpuRequestGpuType),
          detail: z.object({
            normal: z
              .object({
                requestCount: z
                  .number()
                  .min(1, { message: resource.gpu.detail.normal_count }),
              })
              .optional(),
            mig: z
              .array(
                z.object({
                  profile: z.string().min(1),
                  requestCount: z
                    .number()
                    .min(1, { message: resource.gpu.detail.mig_count }),
                }),
              )
              .optional(),
            mps: z
              .object({
                requestCount: z
                  .number()
                  .min(1, { message: resource.gpu.detail.mps_count }),
              })
              .optional(),
          }),
          gpuName: z.string().optional(),
        })
        .optional()
        .nullable(),
    }),
    workloadJobType: z.nativeEnum(WorkloadJobType),
    nodeType: z.nativeEnum(NodeType),
  })
  .refine(
    // CPU, Memory, GPU 중 최소 1개 필수 검증
    (data) => {
      const cpu = data.resource.cpu.requestCore;
      const memory = data.resource.memory.requestByte;
      const gpu = data.resource.gpu?.detail?.normal?.requestCount ?? 0;
      const migCount =
        data.resource.gpu?.detail?.mig?.reduce(
          (sum, item) => sum + item.requestCount,
          0,
        ) ?? 0;
      const mps = data.resource.gpu?.detail?.mps?.requestCount ?? 0;

      return cpu > 0 || memory > 0 || gpu > 0 || migCount > 0 || mps > 0;
    },
    {
      message: resource.at_least_one,
      path: ["resource"],
    },
  )
  .refine(
    (data) => {
      const gpu = data.resource.gpu;
      if (!gpu || gpu.gpuType !== "NORMAL") return true;

      const count = gpu.detail.normal?.requestCount ?? 0;
      return count > 0;
    },
    {
      message: resource.gpu.detail.normal_count,
      path: ["resource", "gpu", "detail", "normal", "requestCount"],
    },
  )
  .refine(
    (data) => {
      const gpu = data.resource.gpu;
      if (!gpu || gpu.gpuType !== "MPS") return true;

      const count = gpu.detail.mps?.requestCount ?? 0;
      return count > 0;
    },
    {
      message: resource.gpu.detail.mps_count,
      path: ["resource", "gpu", "detail", "mps", "requestCount"],
    },
  )
  .refine(
    (data) => {
      const gpu = data.resource.gpu;
      if (!gpu || gpu.gpuType !== "MIG") return true;

      return Boolean(gpu.gpuName);
    },
    {
      message: resource.gpu.gpuName.required,
      path: ["resource", "gpu", "gpuName"],
    },
  )
  .refine(
    (data) => {
      const gpu = data.resource.gpu;
      if (!gpu || gpu.gpuType !== "MIG") return true;

      const migProfiles = gpu.detail.mig;
      return Boolean(migProfiles && migProfiles.length > 0);
    },
    {
      message: resource.gpu.detail.mig_profile,
      path: ["resource", "gpu", "detail", "mig"],
    },
  );

export type CreatePresetBodyExtended = z.infer<typeof createPresetBodyExtended>;
