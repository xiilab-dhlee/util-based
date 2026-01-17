import { z } from "zod";

/** AstraGo 볼륨 생성 폼 스키마 */
export const createAstragoVolumeSchema = z.object({
  volumeName: z
    .string()
    .min(1, "볼륨 이름을 입력해 주세요.")
    .max(50, "볼륨 이름은 50자 이하로 입력해 주세요."),
  isPublic: z.string().min(1, "공개 설정을 선택해 주세요."),
  mountPath: z
    .string()
    .min(1, "마운트 경로를 입력해 주세요.")
    .max(1000, "마운트 경로는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "마운트 경로는 /로 시작해야 합니다."),
  storageId: z.string().min(1, "스토리지를 선택해 주세요."),
});

export type CreateAstragoVolumeFormType = z.infer<
  typeof createAstragoVolumeSchema
>;

/** On-Premise 볼륨 생성 폼 스키마 */
export const createOnPremiseVolumeSchema = z.object({
  volumeName: z
    .string()
    .min(1, "볼륨 이름을 입력해 주세요.")
    .max(50, "볼륨 이름은 50자 이하로 입력해 주세요."),
  isPublic: z.string().min(1, "공개 설정을 선택해 주세요."),
  mountPath: z
    .string()
    .min(1, "마운트 경로를 입력해 주세요.")
    .max(1000, "마운트 경로는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "마운트 경로는 /로 시작해야 합니다."),
  serverIp: z
    .string()
    .min(1, "Server IP를 입력해 주세요.")
    .max(50, "Server IP는 50자 이하로 입력해 주세요.")
    .regex(
      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "유효한 IP 주소 형식이 아닙니다.",
    ),
  volumePath: z
    .string()
    .min(1, "Server Path를 입력해 주세요.")
    .max(1000, "Server Path는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "Server Path는 /로 시작해야 합니다."),
});

export type CreateOnPremiseVolumeFormType = z.infer<
  typeof createOnPremiseVolumeSchema
>;

/** 볼륨 수정 폼 스키마 */
export const updateVolumeSchema = z.object({
  volumeName: z
    .string()
    .min(1, "볼륨 이름을 입력해 주세요.")
    .max(50, "볼륨 이름은 50자 이하로 입력해 주세요."),
  mountPath: z
    .string()
    .min(1, "마운트 경로를 입력해 주세요.")
    .max(1000, "마운트 경로는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "마운트 경로는 /로 시작해야 합니다."),
  isPublic: z.boolean(),
});

export type UpdateVolumeFormType = z.infer<typeof updateVolumeSchema>;

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
  /** 상태 */
  status: z.enum(["PUBLIC", "PRIVATE"]),
  /** 사용 여부 */
  used: z.boolean(),
  /** 볼륨 경로 */
  path: z.string().nullable(),
  /** 라벨 */
  labels: z.array(z.string()),
  /** 볼륨 크기 */
  size: z.number(),
});

// 볼륨 목록용 스키마
export const volumeListSchema = baseVolumeSchema.pick({
  uid: true,
  name: true,
  creatorName: true,
  creatorDate: true,
  storageType: true,
  status: true,
  path: true,
  labels: true,
  size: true,
});

// 볼륨 상세용 스키마
export const volumeDetailSchema = baseVolumeSchema;

// 타입 추출
type Volume = z.infer<typeof baseVolumeSchema>;
export type VolumeListType = z.infer<typeof volumeListSchema>;
export type VolumeIdType = VolumeListType["uid"];
export type VolumeStatusType = Volume["status"];
export type VolumeDetailType = z.infer<typeof volumeDetailSchema>;
export type VolumeStorageType = Volume["storageType"];
