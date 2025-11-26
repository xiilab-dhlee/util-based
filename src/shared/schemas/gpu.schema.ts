import { z } from "zod";

// GPU 전체 스키마
const baseGpuSchema = z.object({
  id: z.string().uuid(),
  /** 이름 */
  name: z.string().min(1).max(200),
  memory: z.number().int().min(1).max(100),
  isAvailable: z.boolean(),
  type: z.enum(["NORMAL", "MPS", "MIG"]),
});

// GPU 사용 노드 스키마
const baseGpuNodeSchema = z.object({
  id: z.string().uuid(),
  /** 이름 */
  name: z.string().min(1).max(200),
  cpuTotal: z.number().int().min(1).max(100),
  cpuUsed: z.number().int().min(1).max(100),
  memoryTotal: z.number().int().min(1).max(100),
  memoryUsed: z.number().int().min(1).max(100),
  gpuTotal: z.number().int().min(1).max(100),
  gpuUsed: z.number().int().min(1).max(100),
});

// GPU 프로파일 스키마
const baseGpuProfileSchema = z.object({
  id: z.string().uuid(),
  /** 이름 */
  name: z.enum(["1g.5gb", "2g.10gb", "3g.15gb", "4g.20gb", "5g.25gb"]),
  memory: z.number().int().min(1).max(100),
  total: z.number().int().min(1).max(100),
  used: z.number().int().min(1).max(100),
});

export const gpuListSchema = baseGpuSchema.pick({
  id: true,
  name: true,
  memory: true,
  isAvailable: true,
  type: true,
});

export const gpuNodeListSchema = baseGpuNodeSchema.pick({
  id: true,
  name: true,
  cpuTotal: true,
  cpuUsed: true,
  memoryTotal: true,
  memoryUsed: true,
  gpuTotal: true,
  gpuUsed: true,
});

export const gpuProfileListSchema = baseGpuProfileSchema.pick({
  id: true,
  name: true,
  memory: true,
  total: true,
  used: true,
});
// 타입 추출
type Gpu = z.infer<typeof baseGpuSchema>;
export type GpuListType = z.infer<typeof gpuListSchema>;
export type GpuProfileListType = z.infer<typeof gpuProfileListSchema>;
export type GpuType = Gpu["type"];
export type GpuNodeListType = z.infer<typeof gpuNodeListSchema>;
