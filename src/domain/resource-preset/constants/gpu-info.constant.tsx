import type {
  ResourcePresetGpuType,
  ResourcePresetNodeType,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import { MultiNodeTooltipTitle } from "@/shared/components/tooltip-title/multi-node-tooltip-title";
import { SingleNodeTooltipTitle } from "@/shared/components/tooltip-title/single-node-tooltip-title";

/* =============================================================================
   GPU 타입 옵션
============================================================================= */

export const GPU_TYPE_OPTIONS: {
  type: ResourcePresetGpuType;
  label: string;
}[] = [
  { type: "NORMAL", label: "Normal GPU" },
  { type: "MIG", label: "MIG" },
  { type: "MPS", label: "MPS" },
];

/**
 * GPU 선택 라벨 반환 (gpuType에 따라 동적 변경)
 */
export const getGpuSelectLabel = (gpuType: ResourcePresetGpuType): string => {
  switch (gpuType) {
    case "NORMAL":
      return "Normal GPU 선택";
    case "MIG":
      return "MIG GPU 선택";
    case "MPS":
      return "MPS GPU 선택";
    default:
      return "GPU 선택";
  }
};

/* =============================================================================
   노드 타입 옵션
============================================================================= */

export const NODE_TYPE_OPTIONS: {
  type: ResourcePresetNodeType;
  label: string;
  icon: "SingleNode" | "MultiNode";
  tooltip: React.ReactNode;
}[] = [
  {
    type: "single",
    label: "Single Node",
    icon: "SingleNode",
    tooltip: <SingleNodeTooltipTitle />,
  },
  {
    type: "multi",
    label: "Multi Node",
    icon: "MultiNode",
    tooltip: <MultiNodeTooltipTitle />,
  },
];
