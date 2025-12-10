import { useCallback, useState } from "react";

import type {
  LicenseFormErrors,
  LicenseFormType,
  RenewLicenseRequestType,
} from "@/domain/system-setting/schemas/license.schema";
import { licenseFormSchema } from "@/domain/system-setting/schemas/license.schema";

const INITIAL_FORM_STATE: LicenseFormType = {
  licenseKey: "",
};

interface UseLicenseFormReturn {
  formState: LicenseFormType;
  errors: LicenseFormErrors;
  setField: <K extends keyof LicenseFormType>(
    field: K,
    value: LicenseFormType[K],
  ) => void;
  validate: () => RenewLicenseRequestType | null;
  reset: () => void;
  initializeForCreate: () => void;
}

/**
 * 라이선스 폼 상태 관리 훅
 * @returns 폼 상태 및 핸들러
 */
export const useLicenseForm = (): UseLicenseFormReturn => {
  const [formState, setFormState] =
    useState<LicenseFormType>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<LicenseFormErrors>({});

  /**
   * 필드 값 변경 및 해당 필드 에러 초기화
   */
  const setField = useCallback(
    <K extends keyof LicenseFormType>(field: K, value: LicenseFormType[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      // 해당 필드 에러 초기화
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [],
  );

  /**
   * 폼 검증 및 요청 payload 반환
   * @returns 검증 성공 시 payload, 실패 시 null
   */
  const validate = useCallback((): RenewLicenseRequestType | null => {
    // Zod safeParse를 사용하여 예외 없이 검증
    const result = licenseFormSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: LicenseFormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LicenseFormType;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return null;
    }

    // 검증 성공 시 에러 초기화
    setErrors({});

    // 폼 스키마 파싱 결과를 그대로 반환 (향후 필드 추가 시에도 보존)
    return result.data as RenewLicenseRequestType;
  }, [formState]);

  /**
   * 폼 초기화
   */
  const reset = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
  }, []);

  /**
   * 생성용 초기화 - 기본 폼 상태로 리셋
   */
  const initializeForCreate = useCallback(() => {
    reset();
  }, [reset]);

  return {
    formState,
    errors,
    setField,
    validate,
    reset,
    initializeForCreate,
  };
};
