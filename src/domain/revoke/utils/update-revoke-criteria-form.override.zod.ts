import { z } from "zod";

import { updateReclaimPolicyBody } from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin.zod";
import { REVOKE_CRITERIA_LIMITS } from "@/domain/revoke/constants/revoke-criteria.constant";
import { REVOKE_CRITERIA_FORM_ERROR_MESSAGES } from "@/domain/revoke/constants/revoke-criteria-form-error-message";

const { OPERATING_HOUR, WARNING_COUNT } = REVOKE_CRITERIA_LIMITS;

/**
 * 리소스 회수 기준 수정 폼 확장 스키마
 *
 * Orval 생성 스키마를 확장하여 추가 유효성 검사 적용:
 * - GPU, CPU, Memory 중 최소 1개는 값이 있어야 함 (0보다 큰 값)
 * - 검사 주기(operatingHour) 필수
 * - 경고 횟수(reclaimWarningCount) 필수, 최소 1회
 */
export const updateReclaimPolicyBodyExtended = updateReclaimPolicyBody.extend({
  metrics: z
    .object({
      gpu: z.number().min(0).max(100).optional().nullable(),
      cpu: z.number().min(0).max(100).optional().nullable(),
      mem: z.number().min(0).max(100).optional().nullable(),
    })
    .refine(
      (metrics) => {
        const gpu = metrics.gpu ?? 0;
        const cpu = metrics.cpu ?? 0;
        const mem = metrics.mem ?? 0;
        return gpu > 0 || cpu > 0 || mem > 0;
      },
      {
        message: REVOKE_CRITERIA_FORM_ERROR_MESSAGES.metrics.atLeastOne,
      },
    ),
  operatingHour: z
    .number({
      required_error:
        REVOKE_CRITERIA_FORM_ERROR_MESSAGES.operatingHour.required,
    })
    .min(OPERATING_HOUR.MIN, {
      message: REVOKE_CRITERIA_FORM_ERROR_MESSAGES.operatingHour.too_small,
    })
    .max(OPERATING_HOUR.MAX, {
      message: REVOKE_CRITERIA_FORM_ERROR_MESSAGES.operatingHour.too_big,
    }),
  reclaimWarningCount: z
    .number({
      required_error:
        REVOKE_CRITERIA_FORM_ERROR_MESSAGES.reclaimWarningCount.required,
    })
    .min(WARNING_COUNT.MIN, {
      message:
        REVOKE_CRITERIA_FORM_ERROR_MESSAGES.reclaimWarningCount.too_small,
    }),
});

export type UpdateReclaimPolicyBodyExtended = z.infer<
  typeof updateReclaimPolicyBodyExtended
>;
