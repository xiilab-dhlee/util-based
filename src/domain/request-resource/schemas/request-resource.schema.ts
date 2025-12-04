import { z } from "zod";

/**
 * 리소스 요청 기본 스키마
 * API에서 사용되는 모든 필드를 정의
 */
const baseRequestResourceSchema = z.object({
  /** 리소스 요청 ID */
  id: z.number().int().positive(),
  /** 워크스페이스 이름 */
  workspaceName: z.string().min(1).max(100),
  /** 워크스페이스 리소스 이름 */
  workspaceResourceName: z.string().min(1).max(100),
  /** 요청 사유 */
  requestReason: z.string().min(1).max(500),
  /** 반려 사유 */
  rejectReason: z.string().min(1).max(500).nullable(),
  /** 상태 */
  status: z.enum(["WAITING", "APPROVE", "REJECT"]),
  /** 수정일 */
  modDate: z.string().datetime(),
  /** 생성일 */
  creatorDateTime: z.string().datetime(),
  /** CPU 기존 할당량 */
  cpuCurrent: z.number().int().min(0).max(100),
  /** GPU 기존 할당량 */
  gpuCurrent: z.number().int().min(0).max(100),
  /** MEM 기존 할당량 */
  memCurrent: z.number().int().min(0).max(9999),
  /** CPU 최대값 */
  cpuMax: z.number().int().min(0).max(100),
  /** GPU 최대값 */
  gpuMax: z.number().int().min(0).max(100),
  /** MEM 최대값 */
  memMax: z.number().int().min(0).max(9999),
  /** CPU 요청량 */
  cpuReq: z.number().int().min(1).max(100),
  /** GPU 요청량 */
  gpuReq: z.number().int().min(1).max(100),
  /** MEM 요청량 */
  memReq: z.number().int().min(1).max(100),
  /** 요청자 */
  requester: z.string().min(1).max(100),
  /** MIG GPU 요청량 (프로파일 목록) - 예: [{ "1g.5gb": 1}, { "2g.10gb": 2}] */
  migGpu: z.array(z.record(z.string(), z.number().int().min(1).max(100))),
});

/**
 * 리소스 요청 목록 스키마
 */
export const requestResourceListSchema = baseRequestResourceSchema.pick({
  id: true,
  workspaceName: true,
  workspaceResourceName: true,
  requestReason: true,
  rejectReason: true,
  status: true,
  modDate: true,
  creatorDateTime: true,
  cpuCurrent: true,
  gpuCurrent: true,
  memCurrent: true,
  cpuMax: true,
  gpuMax: true,
  memMax: true,
  cpuReq: true,
  gpuReq: true,
  memReq: true,
  requester: true,
  migGpu: true,
});

type RequestResource = z.infer<typeof baseRequestResourceSchema>;
/**
 * 리소스 요청 목록 타입
 */
export type RequestResourceListType = z.infer<typeof requestResourceListSchema>;

export type RequestResourceStatusType = RequestResource["status"];

export type RequestResourceMigGpuType = RequestResource["migGpu"];

// ===== Form 스키마 (리소스 승인 폼) =====

/**
 * 리소스 승인 폼 스키마
 * - 기본 검증: 0 이상
 * - max 값은 런타임에 superRefine으로 검증
 */
export const approveResourceFormSchema = z.object({
  gpuApprove: z.number().int().min(0),
  cpuApprove: z.number().int().min(0),
  memApprove: z.number().int().min(0),
});

/** 리소스 승인 폼 상태 타입 */
export type ApproveResourceFormState = z.infer<
  typeof approveResourceFormSchema
>;

/**
 * max 값 포함 검증 스키마 생성 함수
 * - 런타임에 max 값을 알 때 사용
 */
export const createApproveResourceValidationSchema = (
  gpuMax: number,
  cpuMax: number,
  memMax: number,
) => {
  return approveResourceFormSchema.superRefine((data, ctx) => {
    if (data.gpuApprove > gpuMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: gpuMax,
        type: "number",
        inclusive: true,
        path: ["gpuApprove"],
        message: `GPU는 ${gpuMax} 이하여야 합니다.`,
      });
    }
    if (data.cpuApprove > cpuMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: cpuMax,
        type: "number",
        inclusive: true,
        path: ["cpuApprove"],
        message: `CPU는 ${cpuMax} 이하여야 합니다.`,
      });
    }
    if (data.memApprove > memMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: memMax,
        type: "number",
        inclusive: true,
        path: ["memApprove"],
        message: `Memory는 ${memMax} 이하여야 합니다.`,
      });
    }
  });
};

// ===== Request 타입 (프론트 → 서버) =====

/** 리소스 승인 요청 페이로드 */
export type ApproveResourcePayload = ApproveResourceFormState;
