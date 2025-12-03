import { useState } from "react";
import { z } from "zod";

import type { SecurityLevelKey } from "@/shared/constants/security.constant";
import { VULNERABILITY_LEVEL_KEYS } from "@/shared/constants/vulnerability.constant";

const securityLevelSettingSchema = z.object({
  isEnabled: z.boolean(),
  level: z.custom<SecurityLevelKey>(),
  thresholdCount: z.number().int().min(1).max(9999),
});

export type SecurityLevelSettingFormValue = z.infer<
  typeof securityLevelSettingSchema
>;

interface SecurityLevelSettingErrors {
  isEnabled?: string;
  level?: string;
  thresholdCount?: string;
}

interface UseSecurityLevelSettingFormResult {
  formState: SecurityLevelSettingFormValue;
  errors: SecurityLevelSettingErrors;
  setField: <K extends keyof SecurityLevelSettingFormValue>(
    key: K,
    value: SecurityLevelSettingFormValue[K],
  ) => void;
  reset: () => void;
  validate: () => SecurityLevelSettingFormValue | null;
}

const DEFAULT_FORM_VALUE: SecurityLevelSettingFormValue = {
  isEnabled: true,
  level: VULNERABILITY_LEVEL_KEYS[0],
  thresholdCount: 2,
};

export function useSecurityLevelSettingForm(): UseSecurityLevelSettingFormResult {
  const [formState, setFormState] =
    useState<SecurityLevelSettingFormValue>(DEFAULT_FORM_VALUE);
  const [errors, setErrors] = useState<SecurityLevelSettingErrors>({});

  const setField = <K extends keyof SecurityLevelSettingFormValue>(
    key: K,
    value: SecurityLevelSettingFormValue[K],
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const reset = () => {
    setFormState(DEFAULT_FORM_VALUE);
    setErrors({});
  };

  const validate = () => {
    const result = securityLevelSettingSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: SecurityLevelSettingErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SecurityLevelSettingErrors;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return null;
    }

    setErrors({});
    return result.data;
  };

  return {
    formState,
    errors,
    setField,
    reset,
    validate,
  };
}
