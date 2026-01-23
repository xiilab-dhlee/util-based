import { z } from "zod";

/**
 * 레지스트리 이미지 태그 수정 폼 스키마
 *
 * 유효성 검증 규칙:
 * - description: 선택, 태그 설명
 */
export const updateRegistryTagSchema = z.object({
  description: z.string().optional(),
});

export type UpdateRegistryTagFormType = z.infer<typeof updateRegistryTagSchema>;
