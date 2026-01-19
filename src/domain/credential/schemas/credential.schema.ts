import { z } from "zod";

/**
 * 크리덴셜 기본 스키마
 */
const baseCredentialSchema = z.object({
  /** 크리덴셜 ID */
  id: z.number().int().positive(),
  /** 크리덴셜 이름 */
  name: z.string().min(1).max(100),
  /** 크리덴셜 설명 */
  description: z.string().min(1).max(500),
  /** 크리덴셜 타입 */
  type: z.enum(["GIT", "DOCKER"]),
  /** 생성자 이름 */
  creatorName: z.string().min(1).max(100),
  /** 생성자 ID */
  creatorId: z.string().uuid(),
  /** 생성일 */
  creatorDate: z.string().datetime(),
  /** 사용자 아이디 */
  userId: z.string().min(1).max(100),
  /** 토큰 */
  token: z.string().optional(),
});

/**
 * 크리덴셜 목록 Response 스키마
 */
export const credentialListSchema = baseCredentialSchema.pick({
  id: true,
  name: true,
  description: true,
  type: true,
  creatorName: true,
  creatorId: true,
  creatorDate: true,
});

/**
 * 크리덴셜 상세 Response 스키마
 * 보안상 토큰은 제외
 */
export const credentialDetailSchema = baseCredentialSchema.omit({
  token: true,
});

/**
 * 크리덴셜 폼 스키마 (react-hook-form 유효성 검증용)
 *
 * Orval CreateCredentialRequest에 맞춘 스키마
 *
 * 유효성 검증 규칙:
 * - credentialChannel: 필수 (GIT, DOCKER, NGC)
 * - credentialType: 필수 (IMAGE, SOURCE_CODE)
 * - credentialName: 필수, 1~50자
 * - description: 선택, 최대 2000자
 * - credentialAccountId: 필수
 * - token: 필수
 */
export const createCredentialFormSchema = z.object({
  credentialChannel: z.enum(["GIT", "DOCKER", "NGC"], {
    required_error: "채널을 선택해 주세요.",
  }),
  credentialType: z.enum(["IMAGE", "SOURCE_CODE"], {
    required_error: "타입을 선택해 주세요.",
  }),
  credentialName: z
    .string()
    .min(1, "필수 입력 값입니다.")
    .max(50, "이름은 50자 이내로 입력해 주세요."),
  description: z
    .string()
    .max(2000, "설명은 2000자 이내로 입력해 주세요.")
    .optional()
    .or(z.literal("")),
  credentialAccountId: z.string().min(1, "필수 입력 값입니다."),
  token: z.string().min(1, "필수 입력 값입니다."),
});

/**
 * 크리덴셜 폼 타입
 */
export type CreateCredentialFormType = z.infer<
  typeof createCredentialFormSchema
>;

/**
 * 크리덴셜 타입
 */
type Credential = z.infer<typeof baseCredentialSchema>;
export type CredentialListType = z.infer<typeof credentialListSchema>;
export type CredentialDetailType = z.infer<typeof credentialDetailSchema>;
export type CredentialIdType = Credential["id"];
export type CredentialType = Credential["type"];
