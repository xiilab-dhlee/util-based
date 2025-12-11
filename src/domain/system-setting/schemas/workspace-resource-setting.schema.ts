import { z } from "zod";

// ===== 공통 유틸 =====

interface NumericStringSchemaOptions {
  minValue: number;
  fieldName: string;
  required?: boolean;
}

const createNumericStringSchema = ({
  minValue,
  fieldName,
  required = true,
}: NumericStringSchemaOptions) => {
  const rangeMessage =
    minValue === 0
      ? `${fieldName}는 0 이상의 정수여야 합니다.`
      : `${fieldName}는 ${minValue} 이상의 정수여야 합니다.`;

  if (required) {
    return z
      .string()
      .min(1, `${fieldName}를 입력해 주세요.`)
      .refine(
        (value) => {
          if (!/^\d+$/.test(value)) return false;
          const numericValue = Number(value);
          return Number.isInteger(numericValue) && numericValue >= minValue;
        },
        {
          message: rangeMessage,
        },
      );
  }

  return z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || value === "") return true;
        if (!/^\d+$/.test(value)) return false;
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= minValue;
      },
      {
        message: rangeMessage,
      },
    );
};

// ===== 스키마 =====

/**
 * MIG 리소스 스키마
 */
export const migResourceSchema = z.object({
  /** MIG 프로필 (예: "1g.12gb", "2g.20gb") */
  profile: z.string().min(1, "MIG 프로필을 선택해 주세요."),
  /** MIG 개수 */
  count: createNumericStringSchema({ minValue: 1, fieldName: "개수" }),
});

/**
 * 워크스페이스 리소스 설정 폼 스키마
 */
export const workspaceResourceSettingFormSchema = z.object({
  /** GPU 개수 */
  gpu: createNumericStringSchema({ minValue: 0, fieldName: "GPU 개수" }),
  /** MPS 개수 (선택사항) */
  mps: createNumericStringSchema({
    minValue: 0,
    fieldName: "MPS 개수",
    required: false,
  }),
  /** CPU Core 수 */
  cpu: createNumericStringSchema({ minValue: 1, fieldName: "CPU Core 수" }),
  /** Memory GB */
  memory: createNumericStringSchema({ minValue: 1, fieldName: "Memory 용량" }),
  /** 워크스페이스 최대 생성 개수 */
  workspaceCount: createNumericStringSchema({
    minValue: 1,
    fieldName: "워크스페이스 최대 생성 개수",
  }),
  /** MIG 리소스 목록 (선택사항) */
  migResources: z.array(migResourceSchema).optional(),
});

/**
 * 워크스페이스 리소스 설정 Request/Response 공통 스키마
 */
export const workspaceResourceSettingBaseSchema = z.object({
  gpu: z.number().int().nonnegative(),
  mps: z.number().int().nonnegative().optional(),
  cpu: z.number().int().positive(),
  memory: z.number().int().positive(),
  workspaceCount: z.number().int().positive(),
  migResources: z
    .array(
      z.object({
        profile: z.string(),
        count: z.number().int().positive(),
      }),
    )
    .optional(),
});

/**
 * 워크스페이스 리소스 설정 Request 스키마
 */
export const workspaceResourceSettingRequestSchema =
  workspaceResourceSettingBaseSchema;

/**
 * 워크스페이스 리소스 설정 응답 스키마 (미래 API용)
 */
export const workspaceResourceSettingResponseSchema =
  workspaceResourceSettingBaseSchema;

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

/**
 * 워크스페이스 리소스 설정 폼 에러 타입
 *
 * 폼 스키마 타입으로부터 자동 유도된 필드 키를 기반으로 한 에러 맵입니다.
 * 필드가 추가/변경되더라도 타입이 함께 갱신되도록 유지합니다.
 */
export type WorkspaceResourceSettingFormErrors = Partial<
  Record<keyof WorkspaceResourceSettingFormType, string>
>;
