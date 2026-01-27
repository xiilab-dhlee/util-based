import {
  GetPresetsNodeType,
  GetPresetsWorkloadJobType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/* =============================================================================
   리소스 프리셋 상수
============================================================================= */

export const RESOURCE_PRESET_JOB_OPTIONS: {
  value: GetPresetsWorkloadJobType;
  label: string;
}[] = [
  { value: GetPresetsWorkloadJobType.INTERACTIVE, label: "Interactive" },
  { value: GetPresetsWorkloadJobType.BATCH, label: "Batch" },
  { value: GetPresetsWorkloadJobType.DISTRIBUTED, label: "Distributed" },
];

export const RESOURCE_PRESET_NODE_OPTIONS: {
  value: GetPresetsNodeType;
  label: string;
}[] = [
  { value: GetPresetsNodeType.SINGLE, label: "Single Node" },
  { value: GetPresetsNodeType.MULTI, label: "Multi Node" },
];

/**
 * 분산 학습 타입 옵션
 * TODO: 추후 API에서 동적으로 받아올 예정
 */
export const DISTRIBUTED_TYPE_OPTIONS = [
  {
    id: "tensorflow",
    label: "TensorFlow (Training Operator)",
    description: "MPI를 사용한 분산 학습 프레임워크",
  },
  {
    id: "pytorch",
    label: "PyTorch (Training Operator)",
    description: "PyTorch 네이티브 분산 학습",
  },
] as const;
