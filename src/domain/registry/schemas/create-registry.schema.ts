import { z } from "zod";

import { CreateExternalImageRequestRegistryChannel } from "@/api/generated/astragoBackendAPIDocumentation.schemas";

/**
 * 레지스트리 이미지 생성 폼 스키마
 *
 * superRefine을 사용하여 type에 따라 조건부 검증을 수행합니다.
 * - SNAPSHOT: workloadId 필수
 * - EXTERNAL: workloadId 불필요
 *
 * 참고: discriminatedUnion은 react-hook-form의 zodResolver와
 * 호환성 이슈가 있어 superRefine 방식을 사용합니다.
 */
export const createRegistrySchema = z.object({
  imageName: z.string().min(1, "컨테이너 이미지 이름을 입력해 주세요."),
  imageTagName: z
    .string()
    .min(1, "태그를 입력해 주세요.")
    .max(128, "태그는 최대 128자까지 입력 가능합니다.")
    .regex(
      /^[a-zA-Z0-9_][a-zA-Z0-9._-]*$/,
      "첫 글자는 문자/숫자/밑줄(_)만, 이후 문자/숫자/하이픈(-)/밑줄(_)/점(.)만 사용 가능합니다.",
    ),
  registryChannel: z.nativeEnum(CreateExternalImageRequestRegistryChannel, {
    required_error: "레지스트리 채널을 선택해 주세요.",
  }),
  credentialId: z.number().optional(),
  // workloadId: z.string().optional(),
});
// .superRefine((data, ctx) => {
//   if (data.type === "SNAPSHOT" && !data.workloadId) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "워크로드를 선택해 주세요.",
//       path: ["workloadId"],
//     });
//   }
// });

export type CreateRegistryFormType = z.infer<typeof createRegistrySchema>;
