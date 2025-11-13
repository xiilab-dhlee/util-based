import { z } from "zod";

// Hub 기본 스키마 - API에서 사용되는 모든 필드 정의
const baseHubSchema = z.object({
  /** 허브 아이디 */
  id: z.number().int().positive(),
  /** 등록일 */
  creatorDate: z.string().datetime(),
  /** 제목 */
  title: z.string().min(3).max(100),
  /** 설명 */
  description: z.string().min(1).max(500),
  /** 썸네일 파일 URL */
  thumbnailFileUrl: z.string().url(),
});

// 목록 조회용 스키마
export const hubListSchema = baseHubSchema.pick({
  id: true,
  title: true,
  description: true,
  thumbnailFileUrl: true,
});

// 상세 조회용 스키마
export const hubDetailSchema = baseHubSchema;

// 타입 추출
export type HubListType = z.infer<typeof hubListSchema>;
export type HubDetailType = z.infer<typeof hubDetailSchema>;
