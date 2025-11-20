import { z } from "zod";

// 이미지 요청 스키마
const baseRequestImageSchema = z.object({
  /** 이미지 요청 ID */
  id: z.string().uuid(),
  /** 이미지 이름 */
  imageName: z.string().min(1).max(100),
  /** 이미지 태그 */
  imageTag: z.string().min(1).max(50),
  /** 워크스페이스 이름 */
  workspaceName: z.string().min(1).max(100),
  /** 생성자 이름 */
  creatorName: z.string().min(1).max(100),
  /** 상태 */
  status: z.enum(["WAITING", "APPROVE", "REJECT"]),
  /** 생성일 */
  creatorDate: z.string().datetime(),
  /** Critical 취약점 수 */
  critical: z.number().int().min(1).max(100),
  /** High 취약점 수 */
  high: z.number().int().min(1).max(100),
  /** Medium 취약점 수 */
  medium: z.number().int().min(1).max(100),
  /** Low 취약점 수 */
  low: z.number().int().min(1).max(100),
  /** 요청 사유 */
  requestReason: z.string().min(1).max(100),
  /** 반려 사유 */
  rejectReason: z.string().min(1).max(100).optional(),
});

export const requestImageListSchema = baseRequestImageSchema.pick({
  id: true,
  imageName: true,
  imageTag: true,
  workspaceName: true,
  creatorName: true,
  status: true,
  creatorDate: true,
  critical: true,
  high: true,
  medium: true,
  low: true,
  requestReason: true,
  rejectReason: true,
});

export const requestImageDetailSchema = baseRequestImageSchema;

type RequestImage = z.infer<typeof baseRequestImageSchema>;
export type RequestImageListType = z.infer<typeof requestImageListSchema>;
export type RequestImageDetailType = z.infer<typeof requestImageDetailSchema>;
export type RequestImageStatusType = RequestImage["status"];
