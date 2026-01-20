import { z } from "zod";

/**
 * 크리덴셜 생성 스키마
 *
 */
export const createCredentialFormSchema = z.object({
  credentialType: z.enum(["GIT_REPOSITORY", "IMAGE_REGISTRY"], {
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
