import { z } from "zod";

// ============================================
// 폼 스키마 정의
// ============================================

/** 워크로드 수정 폼 스키마 */
export const updateWorkloadSchema = z.object({
  workloadName: z
    .string()
    .min(1, "이름을 입력해 주세요.")
    .max(50, "이름은 50자 이하로 입력해 주세요."),
  description: z
    .string()
    .max(2000, "설명은 2000자 이하로 입력해 주세요.")
    .optional(),
});

export type UpdateWorkloadFormType = z.infer<typeof updateWorkloadSchema>;

/** 워크로드 폴더 생성 폼 스키마 */
export const createWorkloadFolderSchema = z.object({
  folderName: z
    .string()
    .min(1, "폴더 이름을 입력해 주세요.")
    .max(255, "폴더 이름은 255자 이하로 입력해 주세요.")
    .regex(
      /^[^/\\:*?"<>|]+$/,
      '폴더 이름에 특수문자(/ \\ : * ? " < > |)는 사용할 수 없습니다.',
    ),
});

export type CreateWorkloadFolderFormType = z.infer<
  typeof createWorkloadFolderSchema
>;

/** 워크로드 파일 압축 폼 스키마 */
export const compressWorkloadFileSchema = z.object({
  destinationPath: z
    .string()
    .min(1, "저장 경로를 입력해 주세요.")
    .max(1000, "저장 경로는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "저장 경로는 /로 시작해야 합니다."),
  compressFileType: z.enum(["ZIP", "TAR"]),
});

export type CompressWorkloadFileFormType = z.infer<
  typeof compressWorkloadFileSchema
>;

/** 워크로드 파일 업로드 폼 스키마 */
export const uploadWorkloadFileSchema = z.object({
  uploadPath: z
    .string()
    .min(1, "업로드 경로를 입력해 주세요.")
    .max(1000, "업로드 경로는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "업로드 경로는 /로 시작해야 합니다."),
});

export type UploadWorkloadFileFormType = z.infer<
  typeof uploadWorkloadFileSchema
>;
