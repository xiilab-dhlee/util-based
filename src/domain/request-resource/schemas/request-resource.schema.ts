import { z } from "zod";

// ===== Form 스키마 (리소스 승인 폼) =====

/**
 * 리소스 승인 폼 스키마
 * - 기본 검증: 0 이상
 * - max 값은 런타임에 superRefine으로 검증
 */
export const approveResourceFormSchema = z.object({
  gpuApprove: z.number().int().min(0),
  cpuApprove: z.number().int().min(0),
  memApprove: z.number().int().min(0),
});

/** 리소스 승인 폼 상태 타입 */
export type ApproveResourceFormState = z.infer<
  typeof approveResourceFormSchema
>;

/**
 * max 값 포함 검증 스키마 생성 함수
 * - 런타임에 max 값을 알 때 사용
 */
export const createApproveResourceValidationSchema = (
  gpuMax: number,
  cpuMax: number,
  memMax: number,
) => {
  return approveResourceFormSchema.superRefine((data, ctx) => {
    if (data.gpuApprove > gpuMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: gpuMax,
        type: "number",
        inclusive: true,
        path: ["gpuApprove"],
        message: `GPU는 ${gpuMax} 이하여야 합니다.`,
      });
    }
    if (data.cpuApprove > cpuMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: cpuMax,
        type: "number",
        inclusive: true,
        path: ["cpuApprove"],
        message: `CPU는 ${cpuMax} 이하여야 합니다.`,
      });
    }
    if (data.memApprove > memMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: memMax,
        type: "number",
        inclusive: true,
        path: ["memApprove"],
        message: `Memory는 ${memMax} 이하여야 합니다.`,
      });
    }
  });
};

// ===== Request 타입 (프론트 → 서버) =====

/** 리소스 승인 요청 페이로드 */
export type ApproveResourcePayload = ApproveResourceFormState;
