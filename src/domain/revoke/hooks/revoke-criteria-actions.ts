import { useState } from "react";

import { useUpdateReclaimPolicyEnabled } from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin";
import { RECLAIM_POLICY_JOB_TYPES } from "@/domain/revoke/constants/revoke-criteria.constant";

type UpdateRevokeCriteriaEnabledData = Partial<
  Record<
    (typeof RECLAIM_POLICY_JOB_TYPES)[keyof typeof RECLAIM_POLICY_JOB_TYPES],
    boolean
  >
>;

/**
 * 리소스 회수 기준 활성화/비활성화 액션
 * - 변경된 항목만 병렬로 처리
 */
export function useUpdateRevokeCriteriaEnabledAction() {
  const [isPending, setIsPending] = useState(false);
  const batchEnabledMutation = useUpdateReclaimPolicyEnabled();
  const interactiveEnabledMutation = useUpdateReclaimPolicyEnabled();

  const mutateAsync = async (data: UpdateRevokeCriteriaEnabledData) => {
    setIsPending(true);
    try {
      const promises = [];

      const batchEnabled = data[RECLAIM_POLICY_JOB_TYPES.BATCH];
      const interactiveEnabled = data[RECLAIM_POLICY_JOB_TYPES.INTERACTIVE];

      if (batchEnabled !== undefined) {
        promises.push(
          batchEnabledMutation.mutateAsync({
            jobType: RECLAIM_POLICY_JOB_TYPES.BATCH,
            data: { isEnabled: batchEnabled },
          }),
        );
      }

      if (interactiveEnabled !== undefined) {
        promises.push(
          interactiveEnabledMutation.mutateAsync({
            jobType: RECLAIM_POLICY_JOB_TYPES.INTERACTIVE,
            data: { isEnabled: interactiveEnabled },
          }),
        );
      }

      if (promises.length > 0) {
        await Promise.all(promises);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
  };
}
