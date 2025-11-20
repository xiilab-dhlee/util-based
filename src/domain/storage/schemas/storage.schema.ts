import { z } from "zod";

// 스토리지 기본 스키마 - API에서 사용되는 모든 필드 정의
const baseStorageSchema = z.object({
  /** 스토리지 아이디 */
  storageId: z.number().int().positive(),
  /** 스토리지 이름 */
  storageName: z.string().min(1).max(100),
  /** 스토리지 타입 */
  storageType: z.string().min(1).max(100),
});

// 목록 조회용 스키마
export const storageListSchema = baseStorageSchema.pick({
  storageId: true,
  storageName: true,
  storageType: true,
});

// 상세 조회용 스키마
export const storageDetailSchema = baseStorageSchema;

// 타입 추출
export type StorageListType = z.infer<typeof storageListSchema>;
export type StorageDetailType = z.infer<typeof storageDetailSchema>;
