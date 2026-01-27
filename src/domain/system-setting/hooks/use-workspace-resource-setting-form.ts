import { useState } from "react";
import type { z } from "zod";

import {
  type MigResourceType,
  type WorkspaceResourceSettingFormErrors,
  type WorkspaceResourceSettingFormType,
  type WorkspaceResourceSettingRequestType,
  workspaceResourceSettingFormSchema,
  workspaceResourceSettingRequestSchema,
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
  /**
   * 폼 검증
   * - 성공 시 API Request payload를 반환
   * - 실패 시 null 반환
   */
  validate: () => WorkspaceResourceSettingRequestType | null;
  reset: () => void;
  /**
   * 폼 데이터 초기화 (외부에서 데이터를 설정할 때 사용)
   */
  initialize: (data: WorkspaceResourceSettingFormType) => void;
}

// ===== 유틸 함수 =====

/**
 * 초기 폼 상태 생성
 */
function createInitialFormState(): WorkspaceResourceSettingFormType {
  return {
    gpu: "15",
    cpu: "4",
    memory: "12",
    workspaceCount: "12",
    migResources: [],
  };
}

/**
 * Zod 에러를 폼 에러로 변환 (폼 스키마 기준)
 */
function mapZodErrors(
  error: z.ZodError<WorkspaceResourceSettingFormType>,
): WorkspaceResourceSettingFormErrors {
  const errors: WorkspaceResourceSettingFormErrors = {};

  for (const issue of error.issues) {
    const fieldName = issue.path[0] as keyof WorkspaceResourceSettingFormType;
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
  const [initialState, setInitialState] =
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
    const prevList = formState.migResources ?? [];
    const isDuplicate = hasDuplicateMigProfile(
      prevList,
      migResource.profile,
      index,
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
      migResources: (prev.migResources ?? []).map((item, i) =>
        i === index ? migResource : item,
      ),
    }));

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
   *
   * 1차: 폼 스키마(workspaceResourceSettingFormSchema)로 기본 필드 검증
   * 2차: Request 스키마(workspaceResourceSettingRequestSchema)로 타입 및 비즈니스 검증
   *
   * - 성공 시 변환된 Request payload 반환
   * - 실패 시 null 반환
   */
  const validate = (): WorkspaceResourceSettingRequestType | null => {
    // 1차: 폼 스키마 검증 (필수값, 형식 등)
    const formResult = workspaceResourceSettingFormSchema.safeParse(formState);

    if (!formResult.success) {
      setErrors(mapZodErrors(formResult.error));
      return null;
    }

    // 2차: Request 스키마 검증 (숫자 타입, 제약 등)
    const requestResult = workspaceResourceSettingRequestSchema.safeParse({
      gpu: Number(formState.gpu),
      mps: 0, // 항상 0으로 하드코딩
      cpu: Number(formState.cpu),
      memory: Number(formState.memory),
      workspaceCount: Number(formState.workspaceCount),
      migResources:
        formState.migResources && formState.migResources.length > 0
          ? formState.migResources.map((mig) => ({
              profile: mig.profile,
              count: Number(mig.count),
            }))
          : undefined,
    });

    if (!requestResult.success) {
      // Request 스키마 기준 에러는 현재 UI 필드 구조와 1:1 매핑이 어렵기 때문에
      // 일단 전체 폼 에러로 취급하거나, 필요 시 향후 상세 매핑을 확장할 수 있습니다.
      // 여기서는 공통 메시지만 노출하지 않고, 폼 스키마 단계에서 최대한 막는 것을 목표로 합니다.
      return null;
    }

    // 모든 검증 통과 시 에러 초기화 및 payload 반환
    setErrors({});
    return requestResult.data;
  };

  /**
   * 폼 초기화
   */
  const reset = () => {
    setFormState(initialState);
    setErrors({});
  };

  /**
   * 폼 데이터 초기화 (외부에서 데이터를 설정할 때 사용)
   */
  const initialize = (data: WorkspaceResourceSettingFormType) => {
    setFormState(data);
    setInitialState(data);
    setErrors({});
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
    initialize,
  };
}
