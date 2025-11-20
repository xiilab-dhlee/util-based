import { z } from "zod";

// MPS 설정 스키마
const baseMpsInfoSchema = z.object({
  /** 노드 이름 */
  nodeName: z.string().min(1).max(100),
  /** GPU 이름 */
  gpuName: z.string().min(1).max(100),
  /** GPU 개수 */
  gpuCnt: z.number().int().min(1).max(100),
  /** MPS 사용 가능 여부 */
  mpsCapable: z.boolean(),
  /** MPS 복제본 수 */
  mpsReplicas: z.number().int().min(1).max(100),
  /** 전체 메모리 (MB) */
  totalMemory: z.number().int().min(1).max(100),
  /** MPS 최대 복제본 수 */
  mpsMaxReplicas: z.number().int().min(1).max(100),
  /** MPS 상태 */
  mpsStatus: z.string().min(1).max(50),
});

export const mpsInfoSchema = baseMpsInfoSchema;

// type MpsInfo = z.infer<typeof baseMpsInfoSchema>;
export type MpsInfoType = z.infer<typeof mpsInfoSchema>;
