import { z } from "zod";

// 내부 레지스트리 이미지 태그 전체 스키마
const basePrivateRegistryImageTagSchema = z.object({
  /** 태그 고유 ID */
  id: z.number(),
  /** 태그명 */
  tag: z.string().min(1),
  /** 이미지 크기 */
  imageSize: z.string(),
  /** 치명적(Critical) 취약점 수 */
  critical: z.number().int().min(0).max(999),
  /** 높은(High) 취약점 수 */
  high: z.number().int().min(0).max(999),
  /** 중간(Medium) 취약점 수 */
  medium: z.number().int().min(0).max(999),
  /** 낮은(Low) 취약점 수 */
  low: z.number().int().min(0).max(999),
  /** 승인 상태 */
  status: z.string(),
  /** 보안 검사 상태 */
  scanStatus: z.enum(["COMPLETED", "PENDING", "FAILED"]),
  /** 생성일 */
  creatorDate: z.string().datetime(),
  /** 마지막 확인일 */
  lastCheckedAt: z.string().datetime(),
  /** 생성자 */
  creator: z.string(),
  /** 사용 가능 여부 */
  available: z.boolean(),
  /** 요청 사유 */
  requestReason: z.string(),
  /** 반려 사유 */
  rejectReason: z.string(),
});

// 내부 레지스트리 이미지 태그 목록용 스키마
export const privateRegistryImageTagListSchema =
  basePrivateRegistryImageTagSchema;

// 내부 레지스트리 이미지 태그 상세용 스키마
export const privateRegistryImageTagDetailSchema =
  basePrivateRegistryImageTagSchema;

// 타입 추출
export type PrivateRegistryImageTagListType = z.infer<
  typeof privateRegistryImageTagListSchema
>;
export type PrivateRegistryImageTagDetailType = z.infer<
  typeof privateRegistryImageTagDetailSchema
>;
