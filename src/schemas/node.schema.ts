import { z } from "zod";

// 노드 스키마
const baseNodeSchema = z.object({
  /** 노드 ID */
  id: z.string().uuid(),
  /** 노드 이름 */
  nodeName: z.string().min(1).max(100),
  /** IP 주소 */
  ip: z.string().ip(),
  /** GPU 모델명 */
  modelName: z.string().min(1).max(100),
  /** GPU 개수 */
  gpuCount: z.number().int().min(1).max(100),
  /** GPU 사용률 */
  gpuPercent: z.number().int().min(1).max(100),
  /** CPU 사용률 */
  cpuPercent: z.number().int().min(1).max(100),
  /** 메모리 사용률 */
  memPercent: z.number().int().min(1).max(100),
  /** 디스크 사용률 */
  diskPercent: z.number().int().min(1).max(100),
  /** 경과 시간 */
  age: z.object({
    /** 일 */
    days: z.number().int().min(1).max(100),
    /** 시간 */
    hour: z.number().int().min(1).max(100),
    /** 분 */
    minutes: z.number().int().min(1).max(100),
  }),
  /** 상태 */
  status: z.boolean(),
});

export const nodeListSchema = baseNodeSchema.pick({
  id: true,
  nodeName: true,
  ip: true,
  modelName: true,
  gpuCount: true,
  gpuPercent: true,
  cpuPercent: true,
  memPercent: true,
  diskPercent: true,
  age: true,
  status: true,
});

export const nodeDetailSchema = baseNodeSchema;

// type Node = z.infer<typeof baseNodeSchema>;
export type NodeListType = z.infer<typeof nodeListSchema>;
export type NodeDetailType = z.infer<typeof nodeDetailSchema>;
