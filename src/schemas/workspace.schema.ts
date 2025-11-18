import { z } from "zod";

/**
 * 워크스페이스 기본 스키마
 * API에서 사용되는 모든 필드를 정의
 */
const baseWorkspaceSchema = z.object({
  /** 워크스페이스 ID */
  id: z.string().uuid(),
  /** 워크스페이스 이름 */
  name: z.string().min(1).max(100),
  /** 워크스페이스 설명 */
  description: z.string().min(1).max(500),
  /** 생성자 이름 */
  creatorName: z.string().min(1).max(100),
  /** 생성일 */
  creatorDate: z.string().datetime(),
  /** GPU 할당량 */
  gpu: z.number().int().min(0).max(100),
  /** GPU 사용량 */
  gpuUsage: z.number().int().min(0).max(99),
  /** GPU 쿼터 */
  gpuQuota: z.number().int().min(0).max(99),
  /** CPU 할당량 */
  cpu: z.number().int().min(0).max(100),
  /** CPU 사용량 */
  cpuUsage: z.number().int().min(0).max(99),
  /** CPU 쿼터 */
  cpuQuota: z.number().int().min(0).max(99),
  /** MEM 할당량 */
  mem: z.number().int().min(0).max(100),
  /** MEM 사용량 */
  memUsage: z.number().int().min(0).max(99),
  /** MEM 쿼터 */
  memQuota: z.number().int().min(0).max(99),
});

/**
 * 워크스페이스 목록 스키마
 */
export const workspaceListSchema = baseWorkspaceSchema.pick({
  id: true,
  name: true,
  creatorName: true,
  creatorDate: true,
  gpu: true,
  gpuUsage: true,
  gpuQuota: true,
  cpu: true,
  cpuUsage: true,
  cpuQuota: true,
  mem: true,
  memUsage: true,
  memQuota: true,
});

/**
 * 워크스페이스 상세 스키마
 */
export const workspaceDetailSchema = baseWorkspaceSchema;

/**
 * 워크스페이스 목록 타입
 */
export type WorkspaceListType = z.infer<typeof workspaceListSchema>;
export type WorkspaceIdType = WorkspaceListType["id"];

/**
 * 워크스페이스 상세 타입
 */
export type WorkspaceDetailType = z.infer<typeof workspaceDetailSchema>;
