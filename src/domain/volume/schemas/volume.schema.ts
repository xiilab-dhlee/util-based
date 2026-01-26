import { z } from "zod";

// ============================================================================
// 공통 필드 정의
// ============================================================================

/** 볼륨 생성 시 공통으로 사용되는 필드 */
const baseVolumeFields = {
  volumeName: z
    .string()
    .min(1, "볼륨 이름을 입력해 주세요.")
    .max(50, "볼륨 이름은 50자 이하로 입력해 주세요."),
  isPublic: z.boolean({
    required_error: "공개 설정을 선택해 주세요.",
    invalid_type_error: "공개 설정을 선택해 주세요.",
  }),
  mountPath: z
    .string()
    .min(1, "마운트 경로를 입력해 주세요.")
    .max(1000, "마운트 경로는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "마운트 경로는 /로 시작해야 합니다."),
};

// ============================================================================
// 볼륨 생성 스키마
// ============================================================================

/** AstraGo 볼륨 생성 폼 스키마 */
export const createAstragoVolumeSchema = z.object({
  ...baseVolumeFields,
  storageId: z.number({ required_error: "스토리지를 선택해 주세요." }),
  workspaceId: z.number().optional(),
});

export type CreateAstragoVolumeFormType = z.infer<
  typeof createAstragoVolumeSchema
>;

/** On-Premise 볼륨 생성 폼 스키마 */
export const createOnPremiseVolumeSchema = z.object({
  ...baseVolumeFields,
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
  workspaceId: z.number().optional(),
});

export type CreateOnPremiseVolumeFormType = z.infer<
  typeof createOnPremiseVolumeSchema
>;

/** 볼륨 수정 폼 스키마 (baseVolumeFields에서 isPublic 제외 후 boolean 타입으로 재정의) */
export const updateVolumeSchema = z
  .object(baseVolumeFields)
  .omit({ isPublic: true })
  .merge(z.object({ isPublic: z.boolean() }));

export type UpdateVolumeFormType = z.infer<typeof updateVolumeSchema>;

/** 볼륨 폴더 생성 폼 스키마 */
export const createVolumeFolderSchema = z.object({
  folderName: z
    .string()
    .min(1, "폴더 이름을 입력해 주세요.")
    .max(255, "폴더 이름은 255자 이하로 입력해 주세요.")
    .regex(
      /^[^/\\:*?"<>|]+$/,
      '폴더 이름에 특수문자(/ \\ : * ? " < > |)는 사용할 수 없습니다.',
    ),
});

export type CreateVolumeFolderFormType = z.infer<
  typeof createVolumeFolderSchema
>;

/** 볼륨 파일 압축 폼 스키마 */
export const compressVolumeFileSchema = z.object({
  destinationPath: z
    .string()
    .min(1, "저장 경로를 입력해 주세요.")
    .max(1000, "저장 경로는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "저장 경로는 /로 시작해야 합니다."),
  compressFileType: z.enum(["ZIP", "TAR"]),
});

export type CompressVolumeFileFormType = z.infer<
  typeof compressVolumeFileSchema
>;

/** 볼륨 파일 업로드 폼 스키마 */
export const uploadVolumeFileSchema = z.object({
  uploadPath: z
    .string()
    .min(1, "업로드 경로를 입력해 주세요.")
    .max(1000, "업로드 경로는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "업로드 경로는 /로 시작해야 합니다."),
});

export type UploadVolumeFileFormType = z.infer<typeof uploadVolumeFileSchema>;
