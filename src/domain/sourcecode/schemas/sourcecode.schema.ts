import { z } from "zod";

import { credentialListSchema } from "@/domain/credential/schemas/credential.schema";

// 소스코드 전체 스키마
const baseSourcecodeSchema = z.object({
  /** 소스코드 아이디 */
  id: z.number().int().positive(),
  /** 소스코드 이름 */
  name: z.string().min(1).max(100),
  /** 소스코드 상태 */
  status: z.enum(["PUBLIC", "PRIVATE"]),
  /** 코드 타입 (GitHub, GitLab, Bitbucket) */
  type: z.enum(["GIT_HUB", "GIT_LAB", "BIT_BUCKET"]),
  /** Git URL */
  url: z.string().url(),
  /** 생성자 정보 */
  creatorName: z.string().min(1).max(100),
  /** 등록일 */
  creatorDate: z.string().datetime(),
  /** 기본 경로 */
  path: z.string().nullable(),
  /** 실행 명령어 */
  cmd: z.string().nullable(),
  /** 파라미터 목록 */
  parameters: z.array(
    z.object({
      /** 파라미터 키 */
      key: z.string().min(1).max(100),
      /** 파라미터 값 */
      value: z.string().min(1),
    }),
  ),
  /** 크레덴셜 */
  credential: credentialListSchema,
});

// 소스코드 목록용 스키마 (전체와 동일)
export const sourcecodeListSchema = baseSourcecodeSchema.pick({
  id: true,
  name: true,
  type: true,
  creatorName: true,
  creatorDate: true,
  path: true,
  cmd: true,
  url: true,
  status: true,
});

// 소스코드 상세용 스키마 (확장 가능)
export const sourcecodeDetailSchema = baseSourcecodeSchema;

// 타입 추출
type Sourcecode = z.infer<typeof baseSourcecodeSchema>;
export type SourcecodeListType = z.infer<typeof sourcecodeListSchema>;
export type SourcecodeIdType = SourcecodeListType["id"];
export type SourcecodeDetailType = z.infer<typeof sourcecodeDetailSchema>;
export type SourcecodeParameterType = Sourcecode["parameters"][number];
export type SourcecodeType = Sourcecode["type"];
export type SourcecodeStatusType = Sourcecode["status"];
