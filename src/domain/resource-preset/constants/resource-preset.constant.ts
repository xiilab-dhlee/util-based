/* =============================================================================
   리소스 프리셋 상수
============================================================================= */

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

/**
 * Worker 리소스 최대값 (더미)
 * TODO: 추후 API에서 동적으로 받아올 예정
 */
export const WORKER_RESOURCE_MAX = {
  gpu: 8,
  cpu: 200,
  memory: 512,
} as const;

/**
 * 노드 수 범위 (더미)
 * TODO: 추후 API에서 동적으로 받아올 예정
 */
export const NODE_COUNT_RANGE = {
  min: 2,
  max: 100,
} as const;
