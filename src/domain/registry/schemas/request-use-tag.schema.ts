import { z } from "zod";

/**
 * 이미지 태그 사용 요청 폼 스키마
 *
 * 유효성 검증 규칙:
 * - requestReason: 필수, 최대 2000자
 */
export const requestUseTagSchema = z.object({
  requestReason: z
    .string()
    .min(1, "사용 요청 사유를 입력해 주세요.")
    .max(2000, "사용 요청 사유는 최대 2000자까지 입력 가능합니다."),
});

export type RequestUseTagFormType = z.infer<typeof requestUseTagSchema>;
