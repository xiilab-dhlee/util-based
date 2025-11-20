import { z } from "zod";

import { credentialListSchema } from "@/domain/credential/schemas/credential.schema";

// 소스코드 전체 스키마
const baseSourcecodeSchema = z.object({
  /** 소스코드 아이디 */
  id: z.number().int().positive(),
  /** 소스코드 제목 */
  title: z.string().min(1).max(100),
  /** 코드 타입 (GitHub, GitLab, Bitbucket) */
  codeType: z.enum(["GIT_HUB", "GIT_LAB", "BIT_BUCKET"]),
  /** 생성자 정보 */
  creatorName: z.string().min(1).max(100),
  /** 등록일 */
  creatorDate: z.string().datetime(),
  /** 기본 경로 */
  defaultPath: z.string().nullable(),
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
  url: z.string().url().nullable(),
  credential: credentialListSchema,
});

// 소스코드 목록용 스키마 (전체와 동일)
export const sourcecodeListSchema = baseSourcecodeSchema.pick({
  id: true,
  title: true,
  codeType: true,
  creatorName: true,
  creatorDate: true,
  defaultPath: true,
  cmd: true,
});

// 소스코드 상세용 스키마 (확장 가능)
export const sourcecodeDetailSchema = baseSourcecodeSchema;

// 타입 추출
type Sourcecode = z.infer<typeof baseSourcecodeSchema>;
export type SourcecodeListType = z.infer<typeof sourcecodeListSchema>;
export type SourcecodeIdType = SourcecodeListType["id"];
export type SourcecodeDetailType = z.infer<typeof sourcecodeDetailSchema>;
export type SourcecodeParameterType = Sourcecode["parameters"][number];
export type SourcecodeCodeType = Sourcecode["codeType"];
