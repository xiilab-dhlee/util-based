import { z } from "zod";

// 내부 레지스트리 전체 스키마
const basePrivateRegistrySchema = z.object({
  /** 레지스트리 고유 ID */
  id: z.string(),
  /** 레지스트리명 */
  name: z.string().min(1),
  /** 소유자 이름 */
  ownerName: z.string().min(1),
  /** 이미지 개수 */
  imageCount: z.number().int().min(0),
  /** 생성일 */
  creatorDate: z.string().datetime(),
  /** 스토리지 사용량 */
  storageUsage: z.string(),
});

// 내부 레지스트리 목록용 스키마
export const privateRegistryListSchema = basePrivateRegistrySchema;

// 타입 추출
export type PrivateRegistryListType = z.infer<typeof privateRegistryListSchema>;

export type PrivateRegistryIdType = PrivateRegistryListType["id"];
