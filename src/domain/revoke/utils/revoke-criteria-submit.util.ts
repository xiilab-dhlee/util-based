import type { UseFormReturn } from "react-hook-form";

import type {
  GetAllPoliciesResponse,
  UpdateReclaimPolicyParams,
} from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin";
import {
  RECLAIM_POLICY_JOB_TYPES,
  type ReclaimPolicyJobType,
} from "@/domain/revoke/constants/revoke-criteria.constant";
import { DEFAULT_RECLAIM_OPERATOR } from "@/domain/revoke/constants/revoke-history.constant";
import type { UpdateReclaimPolicyBodyExtended } from "@/domain/revoke/utils/update-revoke-criteria-form.override.zod";

/**
 * 폼 값을 API 데이터 형식으로 변환
 */
export const createPolicyUpdateData = (
  values: UpdateReclaimPolicyBodyExtended,
): UpdateReclaimPolicyParams["data"] => ({
  operatingHour: values.operatingHour,
  reclaimWarningCount: values.reclaimWarningCount,
  reclaimOperator: DEFAULT_RECLAIM_OPERATOR,
  metrics: {
    gpu: values.metrics.gpu ?? 0,
    cpu: values.metrics.cpu ?? 0,
    mem: values.metrics.mem ?? 0,
  },
});

/**
 * 변경된 정책 업데이트 수집
 *
 * 주의: isDirty 플래그는 form.reset() 후 정확하지 않을 수 있으므로,
 * 호출자가 활성화된 폼만 이 함수에 넘기도록 하거나,
 * 호출자에서 활성화 여부를 판단해야 합니다.
 */
export const collectPolicyUpdates = (
  batchForm: UseFormReturn<UpdateReclaimPolicyBodyExtended>,
  interactiveForm: UseFormReturn<UpdateReclaimPolicyBodyExtended>,
  batchMutateAsync: (params: UpdateReclaimPolicyParams) => Promise<void>,
  interactiveMutateAsync: (params: UpdateReclaimPolicyParams) => Promise<void>,
): Promise<void>[] => {
  const updates: Promise<void>[] = [];

  if (batchForm.formState.isDirty) {
    updates.push(
      batchMutateAsync({
        jobType: RECLAIM_POLICY_JOB_TYPES.BATCH,
        data: createPolicyUpdateData(batchForm.getValues()),
      }),
    );
  }

  if (interactiveForm.formState.isDirty) {
    updates.push(
      interactiveMutateAsync({
        jobType: RECLAIM_POLICY_JOB_TYPES.INTERACTIVE,
        data: createPolicyUpdateData(interactiveForm.getValues()),
      }),
    );
  }

  return updates;
};

/**
 * 변경된 enabled 상태 수집
 */
export const collectEnabledUpdates = (
  policyList: GetAllPoliciesResponse | undefined,
  batchEnabled: boolean,
  interactiveEnabled: boolean,
): Partial<Record<ReclaimPolicyJobType, boolean>> => {
  const batchPolicy = policyList?.find(
    (p) => p.workloadJobType === RECLAIM_POLICY_JOB_TYPES.BATCH,
  );
  const interactivePolicy = policyList?.find(
    (p) => p.workloadJobType === RECLAIM_POLICY_JOB_TYPES.INTERACTIVE,
  );

  const enabledData: Partial<Record<ReclaimPolicyJobType, boolean>> = {};

  if (batchPolicy && batchPolicy.isEnabled !== batchEnabled) {
    enabledData[RECLAIM_POLICY_JOB_TYPES.BATCH] = batchEnabled;
  }

  if (interactivePolicy && interactivePolicy.isEnabled !== interactiveEnabled) {
    enabledData[RECLAIM_POLICY_JOB_TYPES.INTERACTIVE] = interactiveEnabled;
  }

  return enabledData;
};
