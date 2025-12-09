import { z } from "zod";

// ===== 스키마 =====

/**
 * MIG 리소스 스키마
 */
export const migResourceSchema = z.object({
  /** MIG 프로필 (예: "1g.12gb", "2g.20gb") */
  profile: z.string().min(1, "MIG 프로필을 선택해 주세요."),
  /** MIG 개수 */
  count: z
    .string()
    .min(1, "개수를 입력해 주세요.")
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue > 0;
      },
      {
        message: "개수는 1 이상의 정수여야 합니다.",
      },
    ),
});

/**
 * 워크스페이스 리소스 설정 폼 스키마
 */
export const workspaceResourceSettingFormSchema = z.object({
  /** GPU 개수 */
  gpu: z
    .string()
    .min(1, "GPU 개수를 입력해 주세요.")
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 0;
      },
      {
        message: "GPU 개수는 0 이상의 정수여야 합니다.",
      },
    ),
  /** MPS 개수 (선택사항) */
  mps: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value === "") return true; // 빈 값 허용
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 0;
      },
      {
        message: "MPS 개수는 0 이상의 정수여야 합니다.",
      },
    ),
  /** CPU Core 수 */
  cpu: z
    .string()
    .min(1, "CPU Core 수를 입력해 주세요.")
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue > 0;
      },
      {
        message: "CPU Core 수는 1 이상의 정수여야 합니다.",
      },
    ),
  /** Memory GB */
  memory: z
    .string()
    .min(1, "Memory 용량을 입력해 주세요.")
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue > 0;
      },
      {
        message: "Memory 용량은 1 이상의 정수여야 합니다.",
      },
    ),
  /** 워크스페이스 최대 생성 개수 */
  workspaceCount: z
    .string()
    .min(1, "워크스페이스 최대 생성 개수를 입력해 주세요.")
    .refine(
      (value) => {
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue > 0;
      },
      {
        message: "워크스페이스 최대 생성 개수는 1 이상의 정수여야 합니다.",
      },
    ),
  /** MIG 리소스 목록 (선택사항) */
  migResources: z.array(migResourceSchema),
});

/**
 * 워크스페이스 리소스 설정 Request 스키마
 */
export const workspaceResourceSettingRequestSchema = z.object({
  gpu: z.number().int().nonnegative(),
  mps: z.number().int().nonnegative().optional(),
  cpu: z.number().int().positive(),
  memory: z.number().int().positive(),
  workspaceCount: z.number().int().positive(),
  migResources: z.array(
    z.object({
      profile: z.string(),
      count: z.number().int().positive(),
    }),
  ).optional(),
});

/**
 * 워크스페이스 리소스 설정 응답 스키마 (미래 API용)
 */
export const workspaceResourceSettingResponseSchema = z.object({
  gpu: z.number().int().nonnegative(),
  mps: z.number().int().nonnegative().optional(),
  cpu: z.number().int().positive(),
  memory: z.number().int().positive(),
  workspaceCount: z.number().int().positive(),
  migResources: z.array(
    z.object({
      profile: z.string(),
      count: z.number().int().positive(),
    }),
  ).optional(),
});

// ===== 타입 =====

/** 워크스페이스 리소스 설정 폼 타입 */
export type WorkspaceResourceSettingFormType = z.infer<
  typeof workspaceResourceSettingFormSchema
>;

/** MIG 리소스 타입 */
export type MigResourceType = z.infer<typeof migResourceSchema>;

/** 워크스페이스 리소스 설정 Request 타입 */
export type WorkspaceResourceSettingRequestType = z.infer<
  typeof workspaceResourceSettingRequestSchema
>;

/** 워크스페이스 리소스 설정 응답 타입 */
export type WorkspaceResourceSettingResponseType = z.infer<
  typeof workspaceResourceSettingResponseSchema
>;

/** 워크스페이스 리소스 설정 폼 에러 타입 */
export interface WorkspaceResourceSettingFormErrors {
  gpu?: string;
  mps?: string;
  cpu?: string;
  memory?: string;
  workspaceCount?: string;
  migResources?: string;
}
