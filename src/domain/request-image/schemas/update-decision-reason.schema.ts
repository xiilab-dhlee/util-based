import { z } from "zod";

/**
 * 결정 사유 수정 폼 스키마
 *
 * 유효성 검증 규칙:
 * - decisionReason: 필수, 최대 2000자
 */
export const updateDecisionReasonSchema = z.object({
  decisionReason: z
    .string()
    .trim()
    .min(1, "사유를 입력해 주세요.")
    .max(2000, "사유는 최대 2000자까지 입력 가능합니다."),
});

export type UpdateDecisionReasonFormType = z.infer<
  typeof updateDecisionReasonSchema
>;
