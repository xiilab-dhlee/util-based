import { z } from "zod";

import { CreateSourceCodeRequestSourceCodeType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

// ============================================================================
// 소스코드 파라미터 타입
// ============================================================================

/** 소스코드 파라미터 타입 */
export interface SourcecodeParameterType {
  key: string;
  value: string;
}

// ============================================================================
// 공통 필드 정의
// ============================================================================

const KOREAN_CHAR_REGEX = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;

/** 소스코드 생성/수정 시 공통으로 사용되는 필드 */
const baseSourcecodeFields = {
  sourceCodeName: z
    .string()
    .min(1, "소스코드 이름을 입력해 주세요.")
    .max(50, "소스코드 이름은 50자 이하로 입력해 주세요."),
  mountPath: z
    .string()
    .min(1, "Mount Path를 입력해 주세요.")
    .max(1000, "Mount Path는 1000자 이하로 입력해 주세요.")
    .regex(/^\/.*/, "Mount Path는 /로 시작해야 합니다.")
    .refine(
      (value) => !KOREAN_CHAR_REGEX.test(value),
      "Mount Path에 한글을 입력할 수 없습니다.",
    ),
  executionCmd: z
    .string()
    .min(1, "실행 명령어를 입력해 주세요.")
    .max(1000, "실행 명령어는 1000자 이하로 입력해 주세요.")
    .refine(
      (value) => !KOREAN_CHAR_REGEX.test(value),
      "실행 명령어에 한글을 입력할 수 없습니다.",
    ),
  shouldBePublic: z.boolean({
    required_error: "공개 설정을 선택해 주세요.",
    invalid_type_error: "공개 설정을 선택해 주세요.",
  }),
  credentialId: z.number().nullable().optional(),
};

// ============================================================================
// 소스코드 생성 스키마
// ============================================================================

/** 소스코드 생성 폼 스키마 */
export const createSourcecodeSchema = z.object({
  ...baseSourcecodeFields,
  gitUrl: z
    .string()
    .min(1, "Git URL을 입력해 주세요.")
    .max(1000, "Git URL은 1000자 이하로 입력해 주세요."),
  sourceCodeType: z.nativeEnum(CreateSourceCodeRequestSourceCodeType, {
    errorMap: () => ({ message: "소스코드 타입을 선택해 주세요." }),
  }),
  workspaceId: z.number().optional(),
});

export type CreateSourcecodeFormType = z.infer<typeof createSourcecodeSchema>;

// ============================================================================
// 소스코드 수정 스키마
// ============================================================================

/** 소스코드 수정 폼 스키마 (parameter는 별도 상태로 관리) */
export const updateSourcecodeSchema = z.object(baseSourcecodeFields);

export type UpdateSourcecodeFormType = z.infer<typeof updateSourcecodeSchema>;
