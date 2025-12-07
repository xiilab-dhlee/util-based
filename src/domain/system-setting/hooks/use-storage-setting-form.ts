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

export interface StorageCreateFormErrors {
  storageName?: string;
  storageType?: string;
  ip?: string;
  path?: string;
  [key: string]: string | undefined;
}

export interface StorageUpdateFormErrors {
  id?: string;
  storageName?: string;
  [key: string]: string | undefined;
}

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

function mapZodErrors<TError extends Record<string, string | undefined>>(
  error: z.ZodError,
  initial: TError,
): TError {
  const errors: TError = { ...initial };

  for (const issue of error.issues) {
    const fieldName = issue.path[0];
    if (typeof fieldName === "string" && fieldName in errors) {
      const key = fieldName as keyof TError;
      errors[key] = issue.message as TError[keyof TError];
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

function createUpdateFormErrors(): StorageUpdateFormErrors {
  return {
    id: undefined,
    storageName: undefined,
  };
}

function createCreateFormErrors(): StorageCreateFormErrors {
  return {
    storageName: undefined,
    storageType: undefined,
    ip: undefined,
    path: undefined,
  };
}

// ===== 훅: 생성 폼 =====

export function useStorageCreateForm(): UseStorageCreateFormReturn {
  const [formState, setFormState] = useState<StorageCreateFormState>(
    createInitialCreateFormState,
  );
  const [errors, setErrors] = useState<StorageCreateFormErrors>(
    createCreateFormErrors,
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
      setErrors(mapZodErrors(result.error, createCreateFormErrors()));
      return null;
    }

    setErrors(createCreateFormErrors());
    return result.data;
  };

  const reset = () => {
    setFormState(createInitialCreateFormState());
    setErrors(createCreateFormErrors());
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
    createUpdateFormErrors,
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
    setErrors(createUpdateFormErrors());
  };

  const validate = (): UpdateStorageSettingRequestPayload | null => {
    const result = updateStorageSettingRequestSchema.safeParse(formState);

    if (!result.success) {
      setErrors(mapZodErrors(result.error, createUpdateFormErrors()));
      return null;
    }

    setErrors(createUpdateFormErrors());
    return result.data;
  };

  const reset = () => {
    setFormState(createInitialUpdateFormState());
    setErrors(createUpdateFormErrors());
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
