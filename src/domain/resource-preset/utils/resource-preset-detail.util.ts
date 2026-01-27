import type {
  ResourcePresetResponse,
  ResourcePresetResponseNodeType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  RESOURCE_PRESET_JOB_OPTIONS,
  RESOURCE_PRESET_NODE_OPTIONS,
} from "@/domain/resource-preset/constants/resource-preset.constant";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";

const gpuInfo = getResourceInfo("GPU");
const migInfo = getResourceInfo("MIG");
const mpsInfo = getResourceInfo("MPS");
const cpuInfo = getResourceInfo("CPU");
const memInfo = getResourceInfo("MEM");

export function getNodeTypeLabel(nodeType: ResourcePresetResponseNodeType) {
  return (
    RESOURCE_PRESET_NODE_OPTIONS.find((option) => option.value === nodeType)
      ?.label ?? "-"
  );
}

export function getJobTypeLabel(
  jobType: ResourcePresetResponse["workloadJobType"],
) {
  return (
    RESOURCE_PRESET_JOB_OPTIONS.find((option) => option.value === jobType)
      ?.label ?? "-"
  );
}

export function getGpuResourceLabel(
  gpu: ResourcePresetResponse["resource"]["gpu"] | undefined,
) {
  if (!gpu) {
    return gpuInfo.text;
  }

  switch (gpu.gpuType) {
    case "MIG":
      return migInfo.text;
    case "MPS":
      return mpsInfo.text;
    case "NORMAL":
      return gpuInfo.text;
    default:
      return gpuInfo.text;
  }
}

export function formatGpuResource(
  gpu: ResourcePresetResponse["resource"]["gpu"],
): string {
  if (!gpu) {
    return "-";
  }

  switch (gpu.gpuType) {
    case "MIG": {
      const migProfiles = gpu.detail?.mig ?? [];
      if (migProfiles.length === 0) {
        return "-";
      }

      return migProfiles
        .map(
          (profile) =>
            `${profile.profile} ${formatNumberWithUnit(profile.requestCount, migInfo.unit)}`,
        )
        .join(", ");
    }
    case "MPS":
      return formatNumberWithUnit(gpu.detail?.mps?.requestCount, mpsInfo.unit);
    case "NORMAL":
      return formatNumberWithUnit(
        gpu.detail?.normal?.requestCount,
        gpuInfo.unit,
      );
    default:
      return "-";
  }
}

export function formatCpuResource(requestCore: number): string {
  return formatNumberWithUnit(requestCore, cpuInfo.unit);
}

export function formatMemoryResource(requestByte: number): string {
  const { value } = convertBytes(requestByte, "GB", 0);
  if (value === 0 && requestByte !== 0) {
    return "-";
  }
  return formatNumberWithUnit(value, memInfo.unit);
}
