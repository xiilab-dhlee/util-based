import type { GpuResponseGpuType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { GetPresetsNodeType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { MultiNodeTooltipTitle } from "@/shared/components/tooltip-title/multi-node-tooltip-title";
import { SingleNodeTooltipTitle } from "@/shared/components/tooltip-title/single-node-tooltip-title";

/* =============================================================================
   GPU 타입 옵션
============================================================================= */

export type GpuUiType = GpuResponseGpuType | "NONE";

export const GPU_TYPE_OPTIONS: {
  type: GpuUiType;
  label: string;
}[] = [
  { type: "NORMAL", label: "Normal GPU" },
  { type: "MIG", label: "MIG" },
  { type: "MPS", label: "MPS" },
  { type: "NONE", label: "GPU 미사용" },
];

/**
 * GPU 선택 라벨 반환 (gpuType에 따라 동적 변경)
 */
export const getGpuSelectLabel = (gpuType: GpuUiType): string => {
  switch (gpuType) {
    case "NORMAL":
      return "Normal GPU 선택";
    case "MIG":
      return "MIG GPU 선택";
    case "MPS":
      return "MPS GPU 선택";
    case "NONE":
      return "GPU 미사용";
    default:
      return "GPU 선택";
  }
};

/* =============================================================================
   노드 타입 옵션
============================================================================= */

export const NODE_TYPE_OPTIONS: {
  type: GetPresetsNodeType;
  label: string;
  icon: "SingleNode" | "MultiNode";
  tooltip: React.ReactNode;
}[] = [
  {
    type: GetPresetsNodeType.SINGLE,
    label: "Single Node",
    icon: "SingleNode",
    tooltip: <SingleNodeTooltipTitle />,
  },
  {
    type: GetPresetsNodeType.MULTI,
    label: "Multi Node",
    icon: "MultiNode",
    tooltip: <MultiNodeTooltipTitle />,
  },
];
