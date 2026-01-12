import { z } from "zod";

/**
 * 프라이빗 레지스트리 이미지 생성 폼 스키마
 *
 * 유효성 검증 규칙:
 * - imageName: 필수, 컨테이너 이미지 이름
 * - tag: 필수, 이미지 태그 (문자, 숫자, 하이픈(-), 밑줄(_)만 허용)
 */
export const createPrivateRegistrySchema = z.object({
  imageName: z.string().min(1, "컨테이너 이미지 이름을 입력해 주세요."),
  tag: z
    .string()
    .min(1, "태그를 입력해 주세요.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "문자, 숫자, 하이픈(-), 밑줄(_)만 사용 가능합니다.",
    ),
});

export type CreatePrivateRegistryFormType = z.infer<
  typeof createPrivateRegistrySchema
>;
