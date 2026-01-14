import { z } from "zod";

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

// Form 타입
export type GroupFormType = z.infer<typeof groupFormSchema>;

// Request 타입

export type GroupRequestPayload = z.output<typeof groupRequestSchema>;
