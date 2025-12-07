import { useState } from "react";
import type { z } from "zod";

import { DEFAULT_STORAGE_TYPE } from "@/domain/system-setting/constants/system-setting.constant";
import {
  type CreateStorageSettingRequestPayload,
  createStorageSettingRequestSchema,
  type StorageSettingDetailType,
  type UpdateStorageSettingRequestPayload,
  updateStorageSettingRequestSchema,
} from "@/domain/system-setting/schemas/storage-setting.schema";

// ===== 타입 =====

export type StorageCreateFormState = z.infer<
  typeof createStorageSettingRequestSchema
>;
export type StorageUpdateFormState = z.infer<
  typeof updateStorageSettingRequestSchema
>;

/** 제네릭 폼 에러 타입 */
export type FormErrors<TState> = Partial<Record<keyof TState, string | undefined>>;

export type StorageCreateFormErrors = FormErrors<StorageCreateFormState>;
export type StorageUpdateFormErrors = FormErrors<StorageUpdateFormState>;

interface UseStorageCreateFormReturn {
  formState: StorageCreateFormState;
  errors: StorageCreateFormErrors;
  setField: <Key extends keyof StorageCreateFormState>(
    field: Key,
    value: StorageCreateFormState[Key],
  ) => void;
  validate: () => CreateStorageSettingRequestPayload | null;
  reset: () => void;
}

interface UseStorageUpdateFormReturn {
  formState: StorageUpdateFormState;
  errors: StorageUpdateFormErrors;
  setField: <Key extends keyof StorageUpdateFormState>(
    field: Key,
    value: StorageUpdateFormState[Key],
  ) => void;
  initializeForEdit: (data: StorageSettingDetailType) => void;
  validate: () => UpdateStorageSettingRequestPayload | null;
  reset: () => void;
}

// ===== 유틸 함수 =====

function createInitialCreateFormState(): StorageCreateFormState {
  return {
    storageName: "",
    storageType: DEFAULT_STORAGE_TYPE,
    ip: "",
    path: "",
  };
}

function createInitialUpdateFormState(): StorageUpdateFormState {
  return {
    id: 0,
    storageName: "",
  };
}

/** 제네릭 Zod 에러 매핑 함수 */
function mapZodErrors<TState>(
  error: z.ZodError,
  initial: FormErrors<TState>,
): FormErrors<TState> {
  const errors: FormErrors<TState> = { ...initial };

  for (const issue of error.issues) {
    const fieldName = issue.path[0];
    if (typeof fieldName === "string") {
      const key = fieldName as keyof TState;
      errors[key] = issue.message;
    }
  }

  return errors;
}

function detailToUpdateFormState(
  data: StorageSettingDetailType,
): StorageUpdateFormState {
  return {
    id: data.id,
    storageName: data.storageName,
  };
}

/** 제네릭 폼 에러 초기화 함수 */
function createFormErrors<TState>(): FormErrors<TState> {
  return {};
}

// ===== 훅: 생성 폼 =====

export function useStorageCreateForm(): UseStorageCreateFormReturn {
  const [formState, setFormState] = useState<StorageCreateFormState>(
    createInitialCreateFormState,
  );
  const [errors, setErrors] = useState<StorageCreateFormErrors>(
    createFormErrors<StorageCreateFormState>,
  );

  const setField = <Key extends keyof StorageCreateFormState>(
    field: Key,
    value: StorageCreateFormState[Key],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): CreateStorageSettingRequestPayload | null => {
    const result = createStorageSettingRequestSchema.safeParse(formState);

    if (!result.success) {
      setErrors(mapZodErrors<StorageCreateFormState>(result.error, createFormErrors<StorageCreateFormState>()));
      return null;
    }

    setErrors(createFormErrors<StorageCreateFormState>());
    return result.data;
  };

  const reset = () => {
    setFormState(createInitialCreateFormState());
    setErrors(createFormErrors<StorageCreateFormState>());
  };

  return {
    formState,
    errors,
    setField,
    validate,
    reset,
  };
}

// ===== 훅: 수정 폼 =====

export function useStorageUpdateForm(): UseStorageUpdateFormReturn {
  const [formState, setFormState] = useState<StorageUpdateFormState>(
    createInitialUpdateFormState,
  );
  const [errors, setErrors] = useState<StorageUpdateFormErrors>(
    createFormErrors<StorageUpdateFormState>,
  );

  const setField = <Key extends keyof StorageUpdateFormState>(
    field: Key,
    value: StorageUpdateFormState[Key],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const initializeForEdit = (data: StorageSettingDetailType) => {
    setFormState(detailToUpdateFormState(data));
    setErrors(createFormErrors<StorageUpdateFormState>());
  };

  const validate = (): UpdateStorageSettingRequestPayload | null => {
    const result = updateStorageSettingRequestSchema.safeParse(formState);

    if (!result.success) {
      setErrors(mapZodErrors<StorageUpdateFormState>(result.error, createFormErrors<StorageUpdateFormState>()));
      return null;
    }

    setErrors(createFormErrors<StorageUpdateFormState>());
    return result.data;
  };

  const reset = () => {
    setFormState(createInitialUpdateFormState());
    setErrors(createFormErrors<StorageUpdateFormState>());
  };

  return {
    formState,
    errors,
    setField,
    initializeForEdit,
    validate,
    reset,
  };
}
