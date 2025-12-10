import { useCallback, useState } from "react";
import { ZodError } from "zod";

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
  setField: (field: keyof LicenseFormType, value: string) => void;
  validate: () => RenewLicenseRequestType | null;
  reset: () => void;
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
    (field: keyof LicenseFormType, value: string) => {
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
    try {
      // Zod 스키마로 검증
      const validatedData = licenseFormSchema.parse(formState);

      // 검증 성공 시 에러 초기화
      setErrors({});

      // 요청 payload 반환
      return {
        licenseKey: validatedData.licenseKey,
      };
    } catch (error) {
      // Zod 검증 에러 처리
      if (error instanceof ZodError) {
        const fieldErrors: LicenseFormErrors = {};

        error.errors.forEach((err) => {
          const field = err.path[0] as keyof LicenseFormType;
          fieldErrors[field] = err.message;
        });

        setErrors(fieldErrors);
      }
      return null;
    }
  }, [formState]);

  /**
   * 폼 초기화
   */
  const reset = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
  }, []);

  return {
    formState,
    errors,
    setField,
    validate,
    reset,
  };
};
