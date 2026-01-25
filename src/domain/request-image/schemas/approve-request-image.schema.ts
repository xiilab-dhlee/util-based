import { z } from "zod";

/**
 * 이미지 사용 요청 승인 폼 스키마
 *
 * 유효성 검증 규칙:
 * - approvalReason: 선택, 최대 2000자
 */
export const approveRequestImageSchema = z.object({
  approvalReason: z
    .string()
    .max(2000, "승인 사유는 최대 2000자까지 입력 가능합니다.")
    .optional(),
});

export type ApproveRequestImageFormType = z.infer<
  typeof approveRequestImageSchema
>;
