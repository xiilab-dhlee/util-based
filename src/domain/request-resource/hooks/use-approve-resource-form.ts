import { useState } from "react";

import {
  type ApproveResourceFormState,
  type ApproveResourcePayload,
  createApproveResourceValidationSchema,
} from "@/domain/request-resource/schemas/request-resource.schema";
import type { CoreResourceType } from "@/shared/types/core.interface";

// ===== 상수 =====

const INITIAL_FORM_STATE: ApproveResourceFormState = {
  gpuApprove: 0,
  cpuApprove: 0,
  memApprove: 0,
};

// ===== 타입 =====

type ApproveResourceFormErrors = Partial<
  Record<keyof ApproveResourceFormState, string>
>;

interface UseApproveResourceFormReturn {
  // 상태
  formState: ApproveResourceFormState;
  errors: ApproveResourceFormErrors;

  // 필드 변경
  setApproveValue: (type: CoreResourceType, value: number) => void;

  // 폼 제어
  initialize: (gpuReq: number, cpuReq: number, memReq: number) => void;
  validate: (
    gpuMax: number,
    cpuMax: number,
    memMax: number,
  ) => ApproveResourcePayload | null;
  reset: () => void;
}

// ===== 훅 =====

/**
 * 리소스 승인 폼 상태 및 검증 훅
 * - 순수 폼 상태 관리 (승인값 3개만)
 * - 읽기 전용 데이터는 훅 외부에서 관리
 */
export function useApproveResourceForm(): UseApproveResourceFormReturn {
  const [formState, setFormState] =
    useState<ApproveResourceFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<ApproveResourceFormErrors>({});

  // 승인값 변경 (CoreResourceType 사용)
  const setApproveValue = (type: CoreResourceType, value: number) => {
    const key =
      `${type.toLowerCase()}Approve` as keyof ApproveResourceFormState;
    setFormState((prev) => ({ ...prev, [key]: value }));
    // 해당 필드 에러 클리어
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  // 초기값 설정 (요청량을 초기 승인값으로)
  const initialize = (gpuReq: number, cpuReq: number, memReq: number) => {
    setFormState({
      gpuApprove: gpuReq,
      cpuApprove: cpuReq,
      memApprove: memReq,
    });
    setErrors({});
  };

  // 검증 (max 값 필요) - 성공 시 payload 반환, 실패 시 null
  const validate = (
    gpuMax: number,
    cpuMax: number,
    memMax: number,
  ): ApproveResourcePayload | null => {
    const schema = createApproveResourceValidationSchema(
      gpuMax,
      cpuMax,
      memMax,
    );
    const result = schema.safeParse(formState);

    if (!result.success) {
      const newErrors = result.error.issues.reduce<ApproveResourceFormErrors>(
        (acc, issue) => {
          const pathKey = issue.path[0];

          if (typeof pathKey !== "string" || !(pathKey in INITIAL_FORM_STATE)) {
            return acc;
          }

          const key = pathKey as keyof ApproveResourceFormState;
          acc[key] = issue.message;
          return acc;
        },
        {},
      );
      setErrors(newErrors);
      return null;
    }

    setErrors({});
    return result.data;
  };

  // 리셋
  const reset = () => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
  };

  return {
    formState,
    errors,
    setApproveValue,
    initialize,
    validate,
    reset,
  };
}
