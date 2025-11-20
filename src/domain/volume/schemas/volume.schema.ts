import { z } from "zod";

// 볼륨 전체 스키마
const baseVolumeSchema = z.object({
  /** 볼륨 고유 ID */
  uid: z.string().uuid(),
  /** 리소스 이름 */
  resourceName: z.string().min(1).max(100),
  /** 볼륨 이름 */
  name: z.string().min(1).max(100),
  /** 볼륨 설명 */
  description: z.string().max(500),
  /** 생성일시 */
  creatorDate: z.string().datetime(),
  /** 생성자 이름 */
  creatorName: z.string().min(1).max(100),
  /** 생성자 ID */
  creatorId: z.string().uuid(),
  /** 워크스페이스 이름 */
  workspaceName: z.string().min(1).max(100),
  /** 스토리지 타입 */
  storageType: z.enum(["ASTRAGO", "LOCAL"]),
  /** 사용 여부 */
  used: z.boolean(),
  /** 볼륨 경로 */
  mountPath: z.string().nullable(),
  /** 라벨 */
  labels: z.array(z.string()),
});

// 볼륨 목록용 스키마
export const volumeListSchema = baseVolumeSchema.pick({
  uid: true,
  name: true,
  creatorName: true,
  creatorDate: true,
  storageType: true,
  mountPath: true,
  labels: true,
});

// 볼륨 상세용 스키마
export const volumeDetailSchema = baseVolumeSchema;

// 타입 추출
type Volume = z.infer<typeof baseVolumeSchema>;
export type VolumeListType = z.infer<typeof volumeListSchema>;
export type VolumeIdType = VolumeListType["uid"];
export type VolumeDetailType = z.infer<typeof volumeDetailSchema>;
export type VolumeStorageType = Volume["storageType"];
