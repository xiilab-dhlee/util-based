import { useState } from "react";
import type { z } from "zod";

import {
  accountUpdateRequestSchema,
  type AccountUpdateFormType,
  type AccountUpdateRequestPayload,
} from "@/domain/account-management/schemas/account.schema";
import { ACCOUNT_ROLES } from "@/shared/constants/core.constant";

// ===== 타입 =====

/** 계정 폼 에러 타입 */
export interface AccountFormErrors {
  role?: string;
  isEnabled?: string;
  workspaceLimitCount?: string;
}

/** 훅 반환 타입 */
interface UseAccountFormReturn {
  // 상태
  formState: AccountUpdateFormType;
  errors: AccountFormErrors;

  // 필드 변경
  setField: <Key extends keyof AccountUpdateFormType>(
    field: Key,
    value: AccountUpdateFormType[Key],
  ) => void;

  // 폼 제어
  /** 검증 후 성공 시 payload 반환, 실패 시 null 반환 */
  validate: () => AccountUpdateRequestPayload | null;
  reset: () => void;
  initializeForEdit: (data: AccountUpdateFormType) => void;
}

// ===== 상수 =====

const INITIAL_FORM_STATE: AccountUpdateFormType = {
  role: ACCOUNT_ROLES.USER,
  isEnabled: true,
  workspaceLimitCount: 0,
};

// ===== 유틸 함수 =====

/**
 * Zod 에러를 폼 에러 구조로 매핑
 */
function mapZodErrors(zodError: z.ZodError): AccountFormErrors {
  const entries = zodError.issues
    .filter((issue) => issue.path.length > 0)
    .map((issue) => [issue.path[0], issue.message]);

  return Object.fromEntries(entries) as AccountFormErrors;
}

// ===== 훅 =====

/**
 * 계정 수정 폼 상태 및 검증 훅
 * - 순수 폼 상태 관리 + Zod 검증만 담당
 */
export function useAccountForm(): UseAccountFormReturn {
  // 폼 상태
  const [formState, setFormState] =
    useState<AccountUpdateFormType>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<AccountFormErrors>({});

  // ===== 필드 변경 =====

  const setField = <Key extends keyof AccountUpdateFormType>(
    field: Key,
    value: AccountUpdateFormType[Key],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // 해당 필드 에러 클리어
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ===== 폼 제어 =====

  /**
   * 폼 검증 - 성공 시 변환된 payload 반환, 실패 시 null 반환
   */
  const validate = (): AccountUpdateRequestPayload | null => {
    const result = accountUpdateRequestSchema.safeParse(formState);

    if (!result.success) {
      const mappedErrors = mapZodErrors(result.error);
      setErrors(mappedErrors);
      return null;
    }

    // 에러 클리어 및 검증된 payload 반환
    setErrors({});
    return result.data;
  };

  const reset = () => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
  };

  const initializeForEdit = (data: AccountUpdateFormType) => {
    setFormState(data);
    setErrors({});
  };

  return {
    // 상태
    formState,
    errors,

    // 필드 변경
    setField,

    // 폼 제어
    validate,
    reset,
    initializeForEdit,
  };
}
