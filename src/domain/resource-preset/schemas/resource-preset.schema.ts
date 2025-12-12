import { z } from "zod";

// ===== 공통 상수 =====

/** Job Type 값 */
export const resourcePresetJobTypeValues = [
  "BATCH",
  "INTERACTIVE",
  "DISTRIBUTED",
] as const;

/** Node Type 값 */
export const resourcePresetNodeTypeValues = ["single", "multi"] as const;

/** GPU Type 값 */
export const resourcePresetGpuTypeValues = ["GPU", "MIG", "MPS"] as const;

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

/** 자원 프리셋 기본 응답 스키마 */
const baseResourcePresetResponseSchema = z.object({
  /** 프리셋 아이디 */
  id: z.string().uuid(),
  /** 프리셋 이름 */
  name: z.string(),
  /** 설명 */
  description: z.string().nullable(),
  /** Job Type */
  jobType: z.enum(resourcePresetJobTypeValues),
  /** Node Type */
  nodeType: z.enum(resourcePresetNodeTypeValues),
  /** GPU Type (GPU, MIG, MPS) */
  gpuType: z.enum(resourcePresetGpuTypeValues),
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

// ===== Request 스키마 (프론트 → 서버) =====

/** 자원 프리셋 생성/수정 요청 스키마 */
export const resourcePresetRequestSchema = z.object({
  /** 프리셋 이름 */
  name: z.string().trim().min(1, "프리셋 이름을 입력해 주세요."),
  /** Job Type */
  jobType: z.enum(resourcePresetJobTypeValues),
  /** Node Type */
  nodeType: z.enum(resourcePresetNodeTypeValues),
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

// 기존 호환용 타입 (deprecated - 추후 제거)
export type ResourcePresetListType = ResourcePresetListResponseType;
export type ResourcePresetIdType = ResourcePresetListResponseType["id"];
