import { useState } from "react";
import type { z } from "zod";

import { updateAccountBody } from "@/api/generated/admin-account/admin-account.zod";
import { ACCOUNT_ROLES } from "@/shared/constants/core.constant";

// Orval 생성 Zod 스키마에서 타입 추출
type AccountUpdateFormType = z.infer<typeof updateAccountBody>;
type AccountUpdateRequestPayload = z.output<typeof updateAccountBody>;

// ===== 타입 =====

/** 계정 폼 에러 타입 */
export interface AccountFormErrors {
  accountRole?: string;
  isEnabled?: string;
  workspaceLimitCount?: string;
  [key: string]: string | undefined;
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
  accountRole: ACCOUNT_ROLES.USER,
  isEnabled: true,
  workspaceLimitCount: 1,
  isValid: true,
};

// ===== 유틸 함수 =====

/**
 * Zod 에러를 폼 에러 구조로 매핑
 */
function mapZodErrors(zodError: z.ZodError): AccountFormErrors {
  const pathToKey = (path: Array<string | number>): string => {
    if (path.length === 0) return "_form";

    return path.reduce<string>((acc, segment, index) => {
      if (typeof segment === "number") {
        return `${acc}[${segment}]`;
      }

      const segmentKey = String(segment);

      // 첫 세그먼트는 그대로, 이후는 점 표기
      if (index === 0) return segmentKey;
      return `${acc}.${segmentKey}`;
    }, "");
  };

  return zodError.issues.reduce<AccountFormErrors>((acc, issue) => {
    const key = pathToKey(issue.path as Array<string | number>);

    // 동일 필드에 여러 에러가 있을 수 있으므로 첫 메시지를 우선 보존
    if (!acc[key]) {
      acc[key] = issue.message;
    }

    return acc;
  }, {});
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
    const result = updateAccountBody.safeParse(formState);

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
