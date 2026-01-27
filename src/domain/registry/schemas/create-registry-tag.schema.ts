import { z } from "zod";

/**
 * 레지스트리 이미지 태그 생성 폼 스키마
 *
 * 유효성 검증 규칙:
 * - imageTagName: 필수, 이미지 태그 (최대 128자, 첫글자는 영문/숫자/밑줄, 이후 영문/숫자/하이픈/밑줄/점 허용)
 * - credentialId: 필수, 크리덴셜 ID
 * - description: 선택, 태그 설명
 *
 * 참고: harborImageName은 PubSub을 통해 전달받음
 */
export const createRegistryTagSchema = z.object({
  harborImageName: z.string(),
  imageTagName: z
    .string()
    .min(1, "태그를 입력해 주세요.")
    .max(128, "태그는 최대 128자까지 입력 가능합니다.")
    .regex(
      /^[a-zA-Z0-9_][a-zA-Z0-9._-]*$/,
      "문자, 숫자, 하이픈(-), 밑줄(_), 점(.)만 사용 가능합니다.",
    ),
  credentialId: z.number().optional(),
  description: z.string().optional(),
});

export type CreateRegistryTagFormType = z.infer<typeof createRegistryTagSchema>;
