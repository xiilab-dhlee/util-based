import { z } from "zod";

// 사용자 스키마
const baseAccountSchema = z.object({
  /** 사용자 ID */
  id: z.string().uuid(),
  /** 사용자 이름 */
  name: z.string().min(1).max(100),
  /** 그룹 */
  group: z.string().min(1).max(100),
  /** 권한 */
  role: z.enum(["ADMIN", "USER"]),
  /** 이메일 */
  email: z.string().email(),
  /** 가입일 */
  createdAt: z.string().datetime(),
  /** 상태 */
  status: z.string().min(1).max(50),
});

export const accountListSchema = baseAccountSchema.pick({
  id: true,
  name: true,
  group: true,
  role: true,
  email: true,
  createdAt: true,
  status: true,
});

export const accountDetailSchema = baseAccountSchema;

// type Account = z.infer<typeof baseAccountSchema>;
export type AccountListType = z.infer<typeof accountListSchema>;
export type AccountDetailType = z.infer<typeof accountDetailSchema>;
