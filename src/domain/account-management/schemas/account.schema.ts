import { z } from "zod";

import {
  ACCOUNT_ROLES,
  type AccountRole,
} from "@/shared/constants/core.constant";

// ===== Response 스키마 (서버 → 프론트) =====

/** 계정 기본 응답 스키마 */
const baseAccountResponseSchema = z.object({
  /** 사용자 ID */
  id: z.string().uuid(),
  /** 사용자 이름 */
  name: z.string().min(1).max(100),
  /** 그룹 */
  group: z.string().min(1).max(100),
  /** 권한 */
  role: z.enum(Object.values(ACCOUNT_ROLES) as [AccountRole, ...AccountRole[]]),
  /** 이메일 */
  email: z.string().email(),
  /** 가입일 */
  createdAt: z.string().datetime(),
  /** 활성화 여부 */
  isEnabled: z.boolean(),
  /** 워크스페이스 보유 개수 (조회 전용) */
  workspaceCount: z.number().int().nonnegative(),
  /** 워크스페이스 생성 제한 개수 (수정 가능) */
  workspaceLimitCount: z.number().int().nonnegative(),
});

/** 계정 목록 조회 응답 스키마 */
export const accountListResponseSchema = baseAccountResponseSchema.pick({
  id: true,
  name: true,
  group: true,
  role: true,
  email: true,
  createdAt: true,
  isEnabled: true,
  workspaceCount: true,
  workspaceLimitCount: true,
});

/** 계정 상세 조회 응답 스키마 */
export const accountDetailResponseSchema = baseAccountResponseSchema;

// ===== Form 스키마 (프론트 폼 상태) =====

/** 계정 수정 폼 스키마 */
export const accountUpdateFormSchema = z.object({
  /** 권한 */
  role: z.enum(Object.values(ACCOUNT_ROLES) as [AccountRole, ...AccountRole[]]),
  /** 활성화 여부 */
  isEnabled: z.boolean(),
  /** 워크스페이스 생성 제한 개수 */
  workspaceLimitCount: z.number(),
});

// ===== Request 스키마 (프론트 → 서버) =====

/** 계정 수정 요청 스키마 */
export const accountUpdateRequestSchema = z.object({
  /** 권한 */
  role: z.enum(
    Object.values(ACCOUNT_ROLES) as [AccountRole, ...AccountRole[]],
    {
      required_error: "권한을 선택해주세요.",
    },
  ),
  /** 활성화 여부 */
  isEnabled: z.boolean({
    required_error: "상태를 선택해주세요.",
  }),
  /** 워크스페이스 생성 제한 개수 */
  workspaceLimitCount: z
    .number({
      required_error: "워크스페이스 생성 제한 개수를 입력해주세요.",
    })
    .int("정수를 입력해주세요.")
    .nonnegative("0 이상의 값을 입력해주세요."),
});

// ===== 타입 추출 =====

// Response 타입
export type AccountListType = z.infer<typeof accountListResponseSchema>;
export type AccountDetailType = z.infer<typeof accountDetailResponseSchema>;

// Form 타입
export type AccountUpdateFormType = z.infer<typeof accountUpdateFormSchema>;

// Request 타입
export type AccountUpdateRequestInput = z.input<
  typeof accountUpdateRequestSchema
>;
export type AccountUpdateRequestPayload = z.output<
  typeof accountUpdateRequestSchema
>;
