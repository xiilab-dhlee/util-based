import {
  GpuResponseGpuType,
  type ResourcePresetResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { UpdatePresetBodyExtended } from "@/domain/resource-preset/utils/update-resource-preset-form.override.zod";

type PresetGpuResource = ResourcePresetResponse["resource"]["gpu"];
type PresetGpuDetail = NonNullable<
  UpdatePresetBodyExtended["resource"]["gpu"]
>["detail"];

const DEFAULT_GPU_TYPE = GpuResponseGpuType.NORMAL;

const buildGpuDetail = (
  gpuType: GpuResponseGpuType,
  gpu?: PresetGpuResource,
): PresetGpuDetail => {
  return {
    normal:
      gpuType === GpuResponseGpuType.NORMAL
        ? {
            requestCount: gpu?.detail.normal?.requestCount ?? 0,
          }
        : undefined,
    mig:
      gpuType === GpuResponseGpuType.MIG
        ? gpu?.detail.mig?.map((item) => ({
            profile: item.profile,
            requestCount: item.requestCount,
          }))
        : undefined,
    mps:
      gpuType === GpuResponseGpuType.MPS
        ? {
            requestCount: gpu?.detail.mps?.requestCount ?? 0,
          }
        : undefined,
  };
};

export function mapPresetDetailToUpdateForm(
  detail: ResourcePresetResponse,
): UpdatePresetBodyExtended {
  const gpu = detail.resource.gpu;
  if (!gpu) {
    return {
      presetName: detail.presetName,
      description: detail.description ?? "",
      workloadJobType: detail.workloadJobType,
      nodeType: detail.nodeType,
      resource: {
        cpu: { requestCore: detail.resource.cpu.requestCore },
        memory: { requestByte: detail.resource.memory.requestByte },
        gpu: null,
      },
    };
  }

  const gpuType = gpu.gpuType ?? DEFAULT_GPU_TYPE;

  return {
    presetName: detail.presetName,
    description: detail.description ?? "",
    workloadJobType: detail.workloadJobType,
    nodeType: detail.nodeType,
    resource: {
      cpu: { requestCore: detail.resource.cpu.requestCore },
      memory: { requestByte: detail.resource.memory.requestByte },
      gpu: {
        gpuType,
        gpuName: gpu?.gpuName ?? undefined,
        detail: buildGpuDetail(gpuType, gpu),
      },
    },
  };
}
