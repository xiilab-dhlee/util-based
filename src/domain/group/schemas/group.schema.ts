import { z } from "zod";

// 그룹 스키마
const baseGroupSchema = z.object({
  /** 그룹 ID */
  id: z.string().uuid(),
  /** 그룹 이름 */
  name: z.string().min(1).max(100),
  /** 생성일 */
  createdDate: z.string().datetime(),
  /** 생성자 이름 */
  creatorName: z.string().min(1).max(100).nullable(),
  /** 그룹 설명 */
  description: z.string().min(1).max(100).nullable(),
});

export const groupListSchema = baseGroupSchema.pick({
  id: true,
  name: true,
  createdDate: true,
  creatorName: true,
  description: true,
});

export type GroupListType = z.infer<typeof groupListSchema>;
