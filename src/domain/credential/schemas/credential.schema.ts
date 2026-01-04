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
  /** Private Registry URL (선택적) */
  registryUrl: z.string().url().optional(),
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
 * 유효성 검증 규칙:
 * - 타입: 필수 (GIT 또는 DOCKER)
 * - 이름: 필수, 4~50자, 한글/영문/숫자/-/_/. 만 허용, 앞뒤 공백 불가
 * - 설명: 선택, 최대 500자
 * - 내부 레지스트리 URL: DOCKER 타입일 때 필수, URL 형식
 * - 아이디: 필수, 3자 이상
 * - 토큰: 필수, 4자 이상
 */
export const createCredentialFormSchema = z
  .object({
    type: z.enum(["GIT", "DOCKER"], {
      required_error: "타입을 선택해 주세요.",
    }),
    name: z
      .string()
      .min(1, "필수 입력 값입니다.")
      .min(4, "이름은 4자 이상 입력해 주세요.")
      .max(50, "이름은 50자 이내로 입력해 주세요.")
      .regex(
        /^[가-힣a-zA-Z0-9\-_.]+$/,
        "한글, 영문, 숫자, -, _, .만 사용할 수 있습니다.",
      )
      .refine(
        (value) => value === value.trim(),
        "이름의 앞뒤에는 공백을 포함할 수 없습니다.",
      ),
    description: z
      .string()
      .max(500, "설명은 500자 이내로 입력해 주세요.")
      .optional()
      .or(z.literal("")),
    registryUrl: z
      .string()
      .url("올바른 URL 형식을 입력해 주세요.")
      .optional()
      .or(z.literal("")),
    userId: z
      .string()
      .min(1, "필수 입력 값입니다.")
      .min(3, "아이디는 3자 이상 입력해 주세요."),
    token: z
      .string()
      .min(1, "필수 입력 값입니다.")
      .min(4, "토큰은 4자 이상 입력해 주세요."),
  })
  .refine(
    (data) => {
      // DOCKER 타입일 때 internalRegistryUrl 필수
      if (data.type === "DOCKER") {
        return data.registryUrl && data.registryUrl.length > 0;
      }

      return true;
    },
    {
      message: "Private Registry URL을 입력해 주세요.",
      path: ["registryUrl"],
    },
  );

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
