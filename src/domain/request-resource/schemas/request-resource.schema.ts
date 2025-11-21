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
