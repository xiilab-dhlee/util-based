import { z } from "zod";

// ===== Response 스키마 (서버 → 프론트) =====

/** 그룹 기본 응답 스키마 */
const baseGroupResponseSchema = z.object({
  /** 그룹 ID */
  id: z.string().uuid(),
  /** 그룹 이름 */
  name: z.string().min(1).max(100),
  /** 생성일 */
  createdDate: z.string().datetime(),
  /** 생성자 이름 */
  creatorName: z.string().min(1).max(100).nullable(),
  /** 그룹 설명 */
  description: z.string().min(1).max(100).nullable(),
});

/** 목록 조회 응답 스키마 */
export const groupListResponseSchema = baseGroupResponseSchema.pick({
  id: true,
  name: true,
  createdDate: true,
  creatorName: true,
  description: true,
});

// ===== Form 스키마 (프론트 폼 상태) =====

/** 그룹 폼 스키마 */
export const groupFormSchema = z.object({
  /** 그룹 이름 */
  name: z.string(),
  /** 그룹 설명 */
  description: z.string(),
  /** 멤버 목록 (사용자 ID 배열) */
  members: z.array(z.string()),
});

// ===== Request 스키마 (프론트 → 서버) =====

/** 그룹 생성/수정 요청 스키마 */
export const groupRequestSchema = z.object({
  /** 그룹 이름 */
  name: z.string().trim().min(1, "그룹 이름을 입력해 주세요.").max(100),
  /** 그룹 설명 */
  description: z.string().max(500).optional(),
  /** 멤버 목록 (사용자 ID 배열) */
  members: z.array(z.string()).optional(),
});

// ===== 타입 추출 =====

// Response 타입 (기존 호환성 유지)
export type GroupListType = z.infer<typeof groupListResponseSchema>;
export type GroupListResponseType = z.infer<typeof groupListResponseSchema>;

// Form 타입
export type GroupFormType = z.infer<typeof groupFormSchema>;

// Request 타입
export type GroupRequestInput = z.input<typeof groupRequestSchema>;
export type GroupRequestPayload = z.output<typeof groupRequestSchema>;
