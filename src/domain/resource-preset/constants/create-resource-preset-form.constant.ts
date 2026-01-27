import {
  GetPresetsNodeType,
  GetPresetsWorkloadJobType,
  GpuResponseGpuType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CreatePresetBodyExtended } from "@/domain/resource-preset/utils/create-resource-preset-form.override.zod";

/**
 * 리소스 프리셋 생성/수정 폼 유효성 검사 상수
 */
export const CREATE_RESOURCE_PRESET_FORM_CONSTANTS = {
  presetName: {
    maxLength: 50,
  },
  description: {
    maxLength: 2000,
  },
} as const;

// 기본 메모리 값 (0GB in bytes)
const DEFAULT_MEMORY_BYTES = 0;

export const CREATE_RESOURCE_PRESET_FORM_DEFAULT_VALUES: CreatePresetBodyExtended =
  {
    presetName: "",
    description: "",
    resource: {
      cpu: { requestCore: 0 }, // 기본값 0
      memory: { requestByte: DEFAULT_MEMORY_BYTES }, // 기본값 0GB
      gpu: {
        gpuType: GpuResponseGpuType.NORMAL, // Orval 타입 사용
        detail: {
          normal: { requestCount: 0 }, // 기본값 0
        },
        gpuName: undefined,
      },
    },
    workloadJobType: GetPresetsWorkloadJobType.BATCH, // Orval 타입 사용
    nodeType: GetPresetsNodeType.SINGLE, // Orval 타입 사용
  };
