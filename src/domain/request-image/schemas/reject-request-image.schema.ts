import { z } from "zod";

/**
 * 이미지 사용 요청 반려 폼 스키마
 *
 * 유효성 검증 규칙:
 * - rejectReason: 필수, 최대 2000자
 */
export const rejectRequestImageSchema = z.object({
  rejectReason: z
    .string()
    .min(1, "반려 사유를 입력해 주세요.")
    .max(2000, "반려 사유는 최대 2000자까지 입력 가능합니다."),
});

export type RejectRequestImageFormType = z.infer<
  typeof rejectRequestImageSchema
>;
