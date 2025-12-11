import { useState } from "react";

import {
  type MigResourceType,
  migResourceSchema,
} from "@/domain/system-setting/schemas/workspace-resource-setting.schema";

// ===== 타입 =====

export interface UseMigFormReturn {
  // State
  tempProfile: string | undefined;
  tempCount: string;
  inputError: string;

  // Actions
  setTempProfile: (profile: string | undefined) => void;
  setTempCount: (count: string) => void;
  clearInputError: () => void;

  // Validation
  validateAndGetResource: () => MigResourceType | null;

  // Reset
  resetForm: () => void;
}

// ===== 훅 =====

/**
 * MIG 폼 임시 입력 상태 관리 훅
 *
 * MIG 리소스를 추가하기 전 임시 입력 상태와 검증 로직을 관리합니다.
 */
export function useMigForm(): UseMigFormReturn {
  const [tempProfile, setTempProfileState] = useState<string | undefined>(
    undefined,
  );
  const [tempCount, setTempCountState] = useState("");
  const [inputError, setInputError] = useState("");

  const clearInputError = () => setInputError("");

  const setTempProfile = (profile: string | undefined) => {
    setTempProfileState(profile);
    clearInputError();
  };

  const setTempCount = (count: string) => {
    setTempCountState(count);
    clearInputError();
  };

  /**
   * 입력값 검증 및 MIG 리소스 반환
   * @returns 검증된 MIG 리소스 또는 null (검증 실패 시)
   */
  const validateAndGetResource = (): MigResourceType | null => {
    // 빈 값 검증
    if (!tempProfile) {
      setInputError("MIG 프로필을 선택해 주세요.");
      return null;
    }
    if (!tempCount) {
      setInputError("개수를 입력해 주세요.");
      return null;
    }

    // Zod 스키마 검증
    const result = migResourceSchema.safeParse({
      profile: tempProfile,
      count: tempCount,
    });

    if (!result.success) {
      const firstError =
        result.error.issues[0]?.message ?? "입력값이 유효하지 않습니다.";
      setInputError(firstError);
      return null;
    }

    clearInputError();
    return result.data;
  };

  /**
   * 임시 입력 상태 초기화
   */
  const resetForm = () => {
    setTempProfileState(undefined);
    setTempCountState("");
    clearInputError();
  };

  return {
    // State
    tempProfile,
    tempCount,
    inputError,

    // Actions
    setTempProfile,
    setTempCount,
    clearInputError,

    // Validation
    validateAndGetResource,

    // Reset
    resetForm,
  };
}
