import { useState } from "react";
import type { z } from "zod";

import { GOOGLE_SMTP_CONFIG } from "@/domain/system-setting/constants/system-setting.constant";
import {
  type CreateSmtpRequestPayload,
  type SmtpFormErrors,
  type SmtpFormType,
  type SmtpResponseType,
  smtpFormSchema,
} from "@/domain/system-setting/schemas/smtp.schema";

// ===== 타입 =====

interface UseSmtpFormReturn {
  formState: SmtpFormType;
  errors: SmtpFormErrors;
  setField: <Key extends keyof SmtpFormType>(
    field: Key,
    value: SmtpFormType[Key],
  ) => void;
  setIsGoogle: (isGoogle: boolean) => void;
  validate: () => CreateSmtpRequestPayload | null;
  reset: () => void;
  initializeForEdit: (data: SmtpResponseType) => void;
}

// ===== 유틸 함수 =====

function createInitialFormState(): SmtpFormType {
  return {
    isGoogle: true,
    // 기본 호스트를 Google로 선택하므로, 초기값부터 Google SMTP 고정 값을 넣어준다.
    nodeAddress: GOOGLE_SMTP_CONFIG.nodeAddress,
    nodePort: GOOGLE_SMTP_CONFIG.nodePort,
    account: "",
    password: "",
  };
}

function mapZodErrors(error: z.ZodError<SmtpFormType>): SmtpFormErrors {
  const errors: SmtpFormErrors = {};

  for (const issue of error.issues) {
    const fieldName = issue.path[0] as keyof SmtpFormErrors;
    if (fieldName) {
      errors[fieldName] = issue.message;
    }
  }

  return errors;
}

function responseToFormState(data: SmtpResponseType): SmtpFormType {
  return {
    isGoogle: data.isGoogle,
    nodeAddress: data.nodeAddress,
    nodePort: String(data.nodePort),
    account: data.account,
    password: "",
  };
}

function formStateToPayload(formState: SmtpFormType): CreateSmtpRequestPayload {
  return {
    isGoogle: formState.isGoogle,
    nodeAddress: formState.nodeAddress,
    nodePort: Number(formState.nodePort),
    account: formState.account,
    password: formState.password,
  };
}

// ===== 훅 =====

export function useSmtpForm(): UseSmtpFormReturn {
  const [formState, setFormState] = useState<SmtpFormType>(
    createInitialFormState,
  );
  const [errors, setErrors] = useState<SmtpFormErrors>({});

  const setField = <Key extends keyof SmtpFormType>(
    field: Key,
    value: SmtpFormType[Key],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) =>
      prev && field in prev ? { ...prev, [field]: undefined } : prev,
    );
  };

  const setIsGoogle = (isGoogle: boolean) => {
    setFormState((prev) => ({
      ...prev,
      isGoogle,
      nodeAddress: isGoogle ? GOOGLE_SMTP_CONFIG.nodeAddress : "",
      nodePort: isGoogle ? GOOGLE_SMTP_CONFIG.nodePort : "",
    }));
    setErrors((prev) => ({
      ...prev,
      isGoogle: undefined,
      nodeAddress: undefined,
      nodePort: undefined,
    }));
  };

  const validate = (): CreateSmtpRequestPayload | null => {
    const result = smtpFormSchema.safeParse(formState);

    if (!result.success) {
      setErrors(mapZodErrors(result.error));
      return null;
    }

    setErrors({});
    return formStateToPayload(formState);
  };

  const reset = () => {
    setFormState(createInitialFormState());
    setErrors({});
  };

  const initializeForEdit = (data: SmtpResponseType) => {
    setFormState(responseToFormState(data));
    setErrors({});
  };

  return {
    formState,
    errors,
    setField,
    setIsGoogle,
    validate,
    reset,
    initializeForEdit,
  };
}
