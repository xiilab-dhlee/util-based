import { z } from "zod";

/**
 * 사용자별 리소스 점유율 스키마
 */
export const userResourceSchema = z.object({
  /** 사용자 ID */
  id: z.string().uuid(),
  /** 사용자 이름 */
  userName: z.string().nullable(),
  /** 사용자 이메일 */
  email: z.string().email().nullable(),
  /** GPU 사용량 */
  gpu: z.number().int().min(0),
  /** MIG 사용량 */
  mig: z.number().int().min(0),
  /** MPS 사용량 */
  mps: z.number().int().min(0),
  /** CPU 사용량 */
  cpu: z.number().int().min(0),
  /** MEM 사용량 (GB) */
  mem: z.number().int().min(0),
});

/**
 * 사용자별 리소스 점유율 타입
 */
export type UserResourceSchemaType = z.infer<typeof userResourceSchema>;
