import { z } from "zod";

/**
 * 크레덴셜 기본 스키마
 * API에서 사용되는 모든 필드를 정의
 */
const baseCredentialSchema = z.object({
  /** 크레덴셜 ID */
  id: z.number().int().positive(),
  /** 크레덴셜 이름 */
  name: z.string().min(1).max(100),
  /** 크레덴셜 설명 */
  description: z.string().min(1).max(500),
  /** 크레덴셜 타입 */
  type: z.enum(["GIT", "DOCKER"]),
  /** 생성자 이름 */
  creatorName: z.string().min(1).max(100),
  /** 생성자 ID */
  creatorId: z.string().uuid(),
  /** 생성일 */
  creatorDate: z.string().datetime(),
});

/**
 * 크레덴셜 목록 스키마
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
 * 크레덴셜 목록 타입
 */
type Credential = z.infer<typeof baseCredentialSchema>;
export type CredentialListType = z.infer<typeof credentialListSchema>;
export type CredentialIdType = Credential["id"];
export type CredentialType = Credential["type"];
