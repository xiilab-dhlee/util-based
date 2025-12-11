import { z } from "zod";

/**
 * 크레덴셜 기본 스키마
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
  /** 사용자 아이디 */
  userId: z.string().min(1).max(100),
  /** 토큰 */
  token: z.string().optional(),
  /** Private Registry URL (선택적) */
  registryUrl: z.string().url().optional(),
});

/**
 * 크레덴셜 목록 Response 스키마
 */
export const credentialListResponseSchema = baseCredentialSchema.pick({
  id: true,
  name: true,
  description: true,
  type: true,
  creatorName: true,
  creatorId: true,
  creatorDate: true,
});

/**
 * 크레덴셜 상세 Response 스키마
 * 보안상 토큰은 제외
 */
export const credentialDetailResponseSchema = baseCredentialSchema.omit({
  token: true,
});

/**
 * 크레덴셜 생성 Request 스키마
 */
export const credentialCreateRequestSchema = baseCredentialSchema.pick({
  name: true,
  description: true,
  type: true,
  userId: true,
  token: true,
  registryUrl: true,
});

/**
 * 크레덴셜 타입
 */
type Credential = z.infer<typeof baseCredentialSchema>;
export type CredentialListType = z.infer<typeof credentialListResponseSchema>;
export type CredentialDetailType = z.infer<
  typeof credentialDetailResponseSchema
>;
export type CredentialCreateRequest = z.infer<
  typeof credentialCreateRequestSchema
>;
export type CredentialIdType = Credential["id"];
export type CredentialType = Credential["type"];
