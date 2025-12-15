import {
  type ResourcePresetDetailResponseType,
  type ResourcePresetListResponseType,
  resourcePresetDetailResponseSchema,
  resourcePresetGpuTypeValues,
  resourcePresetJobTypeValues,
  resourcePresetNodeTypeValues,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 리소스 프리셋 Mock 데이터
 *
 * - Zod 스키마를 기반으로 생성합니다.
 */
export const RESOURCE_PRESET_MOCK_LIST_LENGTH = 20;
export const RESOURCE_PRESET_MOCK_TOTAL_COUNT = 45;

const GPU_NAMES = [
  "Tesla-V100-PCIE-32GB",
  "Tesla-V100-PCIE-16GB-SHARED",
  "NVIDIA-A100-80GB",
  "NVIDIA-RTX-3090",
];

const NODE_NAMES = ["worker-1", "worker-2", "worker-3", "gpu-node-1"];

/**
 * 노드 정보 목록 생성
 */
const createNodesMock = (
  nodeType: "single" | "multi",
  index: number,
): ResourcePresetDetailResponseType["nodes"] => {
  const nodeCount = nodeType === "single" ? 1 : (index % 3) + 2;
  return Array.from({ length: nodeCount }, (_, nodeIndex) => ({
    nodeName: NODE_NAMES[(index + nodeIndex) % NODE_NAMES.length],
    nodeGpu: ((index + nodeIndex) % 4) + 1,
    nodeCpu: (((index + nodeIndex) % 8) + 1) * 4,
    nodeMemory: (((index + nodeIndex) % 4) + 1) * 16,
  }));
};

/** 상세 정보를 포함한 전체 Mock 데이터 */
export const RESOURCE_PRESET_DETAIL_MOCK_DATA: ResourcePresetDetailResponseType[] =
  Array.from({ length: RESOURCE_PRESET_MOCK_LIST_LENGTH }, (_, index) => {
    const base = makeMock(resourcePresetDetailResponseSchema);

    const nodeType =
      resourcePresetNodeTypeValues[index % resourcePresetNodeTypeValues.length];

    return {
      ...base,
      id: crypto.randomUUID(),
      name: `프리셋 ${index + 1}`,
      description:
        index % 3 === 0
          ? `개발용에 활용할 수 있는 리소스 프리셋입니다. 프리셋 ${index + 1}에 대한 설명입니다.`
          : null,
      jobType:
        resourcePresetJobTypeValues[index % resourcePresetJobTypeValues.length],
      nodeType,
      gpuType:
        resourcePresetGpuTypeValues[index % resourcePresetGpuTypeValues.length],
      gpuName: GPU_NAMES[index % GPU_NAMES.length],
      gpuMemory: [16, 32, 80, 24][index % 4],
      gpu: (index % 4) + 1,
      gpuMax: 8,
      cpu: ((index % 8) + 1) * 2,
      cpuMax: 128,
      memory: ((index % 4) + 1) * 16,
      memoryMax: 256,
      nodes: createNodesMock(nodeType, index),
      creatorName: ["김민선", "박철수", "이영희"][index % 3],
    };
  });

/** 목록용 Mock 데이터 (상세 필드 제외) */
export const RESOURCE_PRESET_MOCK_DATA: ResourcePresetListResponseType[] =
  RESOURCE_PRESET_DETAIL_MOCK_DATA.map(
    ({ id, name, jobType, nodeType, gpu, cpu, memory, createdAt }) => ({
      id,
      name,
      jobType,
      nodeType,
      gpu,
      cpu,
      memory,
      createdAt,
    }),
  );

/** Mock 데이터 총 개수 (페이지네이션 테스트용) */
export const RESOURCE_PRESET_MOCK_TOTAL = RESOURCE_PRESET_MOCK_TOTAL_COUNT;
