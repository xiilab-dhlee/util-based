import { useState } from "react";
import type { z } from "zod";

import {
  type MigResourceType,
  type WorkspaceResourceSettingFormErrors,
  type WorkspaceResourceSettingFormType,
  workspaceResourceSettingFormSchema,
} from "@/domain/system-setting/schemas/workspace-resource-setting.schema";
import { hasDuplicateMigProfile } from "@/shared/utils/mig-resource.util";

// ===== 타입 =====

interface UseWorkspaceResourceSettingFormReturn {
  formState: WorkspaceResourceSettingFormType;
  errors: WorkspaceResourceSettingFormErrors;
  setField: <Key extends keyof WorkspaceResourceSettingFormType>(
    field: Key,
    value: WorkspaceResourceSettingFormType[Key],
  ) => void;
  addMigResource: (migResource: MigResourceType) => boolean;
  updateMigResource: (index: number, migResource: MigResourceType) => boolean;
  removeMigResource: (index: number) => void;
  validate: () => boolean;
  reset: () => void;
  hasUnsavedChanges: () => boolean;
}

// ===== 유틸 함수 =====

/**
 * 초기 폼 상태 생성
 */
function createInitialFormState(): WorkspaceResourceSettingFormType {
  return {
    gpu: "15",
    mps: "",
    cpu: "4",
    memory: "12",
    workspaceCount: "12",
    migResources: [],
  };
}

/**
 * Zod 에러를 폼 에러로 변환
 */
function mapZodErrors(
  error: z.ZodError<WorkspaceResourceSettingFormType>,
): WorkspaceResourceSettingFormErrors {
  const errors: WorkspaceResourceSettingFormErrors = {};

  for (const issue of error.issues) {
    const fieldName = issue.path[0] as keyof WorkspaceResourceSettingFormErrors;
    if (fieldName) {
      errors[fieldName] = issue.message;
    }
  }

  return errors;
}

// ===== 훅 =====

/**
 * 워크스페이스 리소스 설정 폼 훅
 *
 * 폼 상태 관리, MIG 리소스 목록 관리, 검증 기능 제공
 */
export function useWorkspaceResourceSettingForm(
  initialValue?: WorkspaceResourceSettingFormType,
): UseWorkspaceResourceSettingFormReturn {
  const getInitialState = () =>
    (initialValue as WorkspaceResourceSettingFormType | undefined) ??
    createInitialFormState();

  const [formState, setFormState] =
    useState<WorkspaceResourceSettingFormType>(getInitialState);
  const [errors, setErrors] = useState<WorkspaceResourceSettingFormErrors>({});
  const [initialState] =
    useState<WorkspaceResourceSettingFormType>(getInitialState);

  /**
   * 개별 필드 값 설정
   */
  const setField = <Key extends keyof WorkspaceResourceSettingFormType>(
    field: Key,
    value: WorkspaceResourceSettingFormType[Key],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // 해당 필드의 에러 제거
    setErrors((prev) =>
      prev && field in prev ? { ...prev, [field]: undefined } : prev,
    );
  };

  /**
   * MIG 리소스 추가
   * @returns 추가 성공 여부 (중복 시 false)
   */
  const addMigResource = (migResource: MigResourceType): boolean => {
    // 중복 프로필 확인
    const isDuplicate = hasDuplicateMigProfile(
      formState.migResources ?? [],
      migResource.profile,
    );

    if (isDuplicate) {
      setErrors((prev) => ({
        ...prev,
        migResources: "이미 추가된 MIG 프로필입니다.",
      }));
      return false;
    }

    setFormState((prev) => ({
      ...prev,
      migResources: [...(prev.migResources ?? []), migResource],
    }));

    setErrors((prev) => ({
      ...prev,
      migResources: undefined,
    }));

    return true;
  };

  /**
   * MIG 리소스 수정
   */
  const updateMigResource = (
    index: number,
    migResource: MigResourceType,
  ): boolean => {
    let hasDuplicate = false;

    setFormState((prev) => {
      hasDuplicate = hasDuplicateMigProfile(
        prev.migResources ?? [],
        migResource.profile,
        index,
      );

      if (hasDuplicate) {
        return prev;
      }

      return {
        ...prev,
        migResources: (prev.migResources ?? []).map((item, i) =>
          i === index ? migResource : item,
        ),
      };
    });

    if (hasDuplicate) {
      setErrors((prev) => ({
        ...prev,
        migResources: "이미 추가된 MIG 프로필입니다.",
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      migResources: undefined,
    }));

    return true;
  };

  /**
   * MIG 리소스 제거
   */
  const removeMigResource = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      migResources: (prev.migResources ?? []).filter((_, i) => i !== index),
    }));
  };

  /**
   * 폼 검증
   * @returns 검증 성공 여부
   */
  const validate = (): boolean => {
    const result = workspaceResourceSettingFormSchema.safeParse(formState);

    if (!result.success) {
      setErrors(mapZodErrors(result.error));
      return false;
    }

    setErrors({});
    return true;
  };

  /**
   * 폼 초기화
   */
  const reset = () => {
    setFormState(initialState);
    setErrors({});
  };

  /**
   * 저장되지 않은 변경사항 확인
   */
  const hasUnsavedChanges = (): boolean => {
    return JSON.stringify(formState) !== JSON.stringify(initialState);
  };

  return {
    formState,
    errors,
    setField,
    addMigResource,
    updateMigResource,
    removeMigResource,
    validate,
    reset,
    hasUnsavedChanges,
  };
}
