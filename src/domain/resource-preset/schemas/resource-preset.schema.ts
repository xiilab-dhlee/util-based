import { z } from "zod";

import {
  NODE_MODE_VALUES,
  type NodeModeType,
} from "@/shared/constants/core.constant";
import type {
  GpuListType,
  GpuNodeListType,
  GpuProfileListType,
} from "@/shared/schemas/gpu.schema";
import { GPU_TYPE_VALUES, type GpuType } from "@/shared/schemas/gpu.schema";

// ===== 공통 상수/타입 =====

/** 리소스 프리셋 Job Type 값 (BATCH, INTERACTIVE만 지원) */
export const RESOURCE_PRESET_JOB_TYPE_VALUES = [
  "BATCH",
  "INTERACTIVE",
] as const;

/** Job Type 값 (호환성을 위한 별칭) */
export { RESOURCE_PRESET_JOB_TYPE_VALUES as resourcePresetJobTypeValues };
/** Node Type 값 */
export { NODE_MODE_VALUES as resourcePresetNodeTypeValues };
/** GPU Type 값 */
export { GPU_TYPE_VALUES as resourcePresetGpuTypeValues };

export type ResourcePresetJobType =
  (typeof RESOURCE_PRESET_JOB_TYPE_VALUES)[number];
export type ResourcePresetNodeType = NodeModeType;
export type ResourcePresetGpuType = GpuType;

// ===== Response 스키마 (서버 → 프론트) =====

/** 노드 정보 스키마 */
export const resourcePresetNodeInfoSchema = z.object({
  /** 노드 이름 */
  nodeName: z.string(),
  /** 노드 GPU 개수 */
  nodeGpu: z.number(),
  /** 노드 CPU (Core) */
  nodeCpu: z.number(),
  /** 노드 Memory (GB) */
  nodeMemory: z.number(),
});

/** 리소스 프리셋 기본 응답 스키마 */
const baseResourcePresetResponseSchema = z.object({
  /** 프리셋 아이디 */
  id: z.string().uuid(),
  /** 프리셋 이름 */
  name: z.string(),
  /** 설명 */
  description: z.string().nullable(),
  /** Job Type */
  jobType: z.enum(RESOURCE_PRESET_JOB_TYPE_VALUES),
  /** Node Type */
  nodeType: z.enum(NODE_MODE_VALUES),
  /** GPU Type (NORMAL, MIG, MPS) */
  gpuType: z.enum(GPU_TYPE_VALUES),
  /** GPU 이름 */
  gpuName: z.string(),
  /** GPU Memory (GB) */
  gpuMemory: z.number(),
  /** GPU 개수 */
  gpu: z.number(),
  /** GPU 최대값 */
  gpuMax: z.number(),
  /** CPU 개수 */
  cpu: z.number(),
  /** CPU 최대값 */
  cpuMax: z.number(),
  /** Memory (GB) */
  memory: z.number(),
  /** Memory 최대값 (GB) */
  memoryMax: z.number(),
  /** 노드 정보 목록 */
  nodes: z.array(resourcePresetNodeInfoSchema),
  /** 생성자 이름 */
  creatorName: z.string(),
  /** 생성일 */
  createdAt: z.string().datetime(),
});

/** 목록 조회 응답 스키마 */
export const resourcePresetListResponseSchema =
  baseResourcePresetResponseSchema.pick({
    id: true,
    name: true,
    jobType: true,
    nodeType: true,
    gpu: true,
    cpu: true,
    memory: true,
    createdAt: true,
  });

/** 상세 조회 응답 스키마 */
export const resourcePresetDetailResponseSchema =
  baseResourcePresetResponseSchema;

// ===== Form 스키마 (프론트 폼 상태) =====

/** Single Node 리소스 */
export interface SingleNodeResource {
  /** GPU 개수 */
  gpu: number;
  /** CPU 개수 */
  cpu: number;
  /** Memory (GB) */
  memory: number;
}

/** Multi Node 리소스 */
export interface MultiNodeResource {
  /** 분산 학습 타입 */
  distributedType: string | null;
  /** 노드 수 */
  nodeCount: number;
  /** Worker GPU 개수 */
  workerGpu: number;
  /** Worker CPU 개수 */
  workerCpu: number;
  /** Worker Memory (GB) */
  workerMemory: number;
}

/** 리소스 프리셋 폼 상태 타입 (Zod 스키마 없이 타입만 정의) */
export interface ResourcePresetFormType {
  /** 프리셋 이름 */
  name: string;
  /** 설명 */
  description: string;
  /** Job Type */
  jobType: ResourcePresetJobType;
  /** Node Type */
  nodeType: ResourcePresetNodeType;
  /** GPU Type */
  gpuType: ResourcePresetGpuType;
  /** 선택된 GPU */
  selectedGpu: GpuListType | null;
  /** 선택된 GPU 노드 (NORMAL, MPS용) */
  selectedNode: GpuNodeListType | null;
  /** 선택된 MIG 프로필 (MIG용) */
  selectedProfile: GpuProfileListType | null;

  // ===== 리소스 (객체로 통합) =====
  /** Single Node 리소스 */
  singleNodeResource: SingleNodeResource;
  /** Multi Node 리소스 */
  multiNodeResource: MultiNodeResource;
}

/** 폼 에러 타입 */
export interface ResourcePresetFormErrors {
  name?: string;
  jobType?: string;
  nodeType?: string;
  gpuType?: string;
  selectedGpu?: string;
  selectedNode?: string;
  selectedProfile?: string;
}

// ===== Request 스키마 (프론트 → 서버) =====

/** 리소스 프리셋 생성/수정 요청 스키마 */
export const resourcePresetRequestSchema = z.object({
  /** 프리셋 이름 */
  name: z.string().trim().min(1, "프리셋 이름을 입력해 주세요."),
  /** 설명 (선택) */
  description: z.string().nullable().optional(),
  /** Job Type */
  jobType: z.enum(RESOURCE_PRESET_JOB_TYPE_VALUES),
  /** Node Type */
  nodeType: z.enum(NODE_MODE_VALUES),
  /** GPU Type (NORMAL, MIG, MPS) */
  gpuType: z.enum(GPU_TYPE_VALUES),
  /** GPU ID */
  gpuId: z.number(),
  /** GPU 사용 노드 이름 (빈 문자열은 undefined로 처리) */
  nodeName: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(1, "GPU 사용 노드를 선택해 주세요.").optional(),
  ),
  /** GPU 개수 */
  gpu: z.number().min(0),
  /** CPU 개수 */
  cpu: z.number().min(0),
  /** Memory (GB) */
  memory: z.number().min(0),
});

// ===== 타입 추출 =====

// Response 타입
export type ResourcePresetNodeInfoType = z.infer<
  typeof resourcePresetNodeInfoSchema
>;
export type ResourcePresetListResponseType = z.infer<
  typeof resourcePresetListResponseSchema
>;
export type ResourcePresetDetailResponseType = z.infer<
  typeof resourcePresetDetailResponseSchema
>;

// Request 타입
export type ResourcePresetRequestInput = z.input<
  typeof resourcePresetRequestSchema
>;
export type ResourcePresetRequestPayload = z.output<
  typeof resourcePresetRequestSchema
>;
