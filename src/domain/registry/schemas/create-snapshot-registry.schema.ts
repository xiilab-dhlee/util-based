import { z } from "zod";

/**
 * 스냅샷 환경변수 스키마
 */
export const snapshotEnvSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .max(253, "환경변수 이름은 최대 253자까지 입력 가능합니다.")
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      "첫 글자는 영문자 또는 밑줄(_)만, 이후 영문자/숫자/밑줄(_)만 사용 가능합니다.",
    )
    .optional(),
  value: z
    .string()
    .max(32768, "환경변수 값은 최대 32768자까지 입력 가능합니다.")
    .optional(),
});

/**
 * 스냅샷 포트 스키마
 */
export const snapshotPortSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .max(15, "포트 이름은 최대 15자까지 입력 가능합니다.")
    .regex(
      /^(?![0-9-])(?!.*--)(?!.*-$)[a-z0-9-]*[a-z][a-z0-9-]*$/,
      "소문자/숫자/하이픈만 사용 가능하며, 최소 1개 영문자가 필요합니다.",
    )
    .optional(),
  port: z.coerce
    .number()
    .min(1, "포트 번호는 1 이상이어야 합니다.")
    .max(65535, "포트 번호는 65535 이하여야 합니다.")
    .optional(),
});

/**
 * 스냅샷 레지스트리 이미지 생성 폼 스키마
 *
 * 유효성 검증 규칙:
 * - workloadId: 필수, 스냅샷 대상 워크로드 ID
 * - imageName: 필수, 이미지 이름 (최대 255자)
 * - imageTagName: 필수, 이미지 태그 (최대 128자)
 * - description: 선택, 이미지 설명
 * - env: 선택, 환경변수 목록
 * - port: 선택, 포트 목록
 */
export const createSnapshotRegistrySchema = z.object({
  workloadId: z.number({
    required_error: "워크로드를 선택해 주세요.",
  }),
  imageName: z
    .string()
    .min(1, "컨테이너 이미지 이름을 입력해 주세요.")
    .max(255, "이미지 이름은 최대 255자까지 입력 가능합니다."),
  imageTagName: z
    .string()
    .min(1, "태그를 입력해 주세요.")
    .max(128, "태그는 최대 128자까지 입력 가능합니다.")
    .regex(
      /^[a-zA-Z0-9_][a-zA-Z0-9._-]*$/,
      "첫 글자는 문자/숫자/밑줄(_)만, 이후 문자/숫자/하이픈(-)/밑줄(_)/점(.)만 사용 가능합니다.",
    ),
  description: z.string().optional(),
  env: z.array(snapshotEnvSchema).optional(),
  port: z.array(snapshotPortSchema).optional(),
});

export type SnapshotEnvFormType = z.infer<typeof snapshotEnvSchema>;
export type SnapshotPortFormType = z.infer<typeof snapshotPortSchema>;
export type CreateSnapshotRegistryFormType = z.infer<
  typeof createSnapshotRegistrySchema
>;
