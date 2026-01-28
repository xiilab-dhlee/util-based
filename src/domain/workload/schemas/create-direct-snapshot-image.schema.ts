import { z } from "zod";

/**
 * Direct Snapshot Image 생성 폼 스키마
 *
 * 워크로드 상세 페이지에서 스냅샷 이미지를 생성할 때 사용됩니다.
 */
export const createDirectSnapshotImageSchema = z.object({
  imageName: z.string().min(1, "이미지 이름을 입력해 주세요."),
  imageTagName: z
    .string()
    .min(1, "태그를 입력해 주세요.")
    .max(128, "태그는 최대 128자까지 입력 가능합니다.")
    .regex(
      /^[a-zA-Z0-9_][a-zA-Z0-9._-]*$/,
      "첫 글자는 문자/숫자/밑줄(_)만, 이후 문자/숫자/하이픈(-)/밑줄(_)/점(.)만 사용 가능합니다.",
    ),
});

export type CreateDirectSnapshotImageFormType = z.infer<
  typeof createDirectSnapshotImageSchema
>;
