"use client";

import { useState } from "react";

import type { SourcecodeParameterType } from "@/domain/sourcecode/schemas/sourcecode.schema";

// ===== 타입 =====

export interface UseSourcecodeParameterFormReturn {
  // State
  tempKey: string;
  tempValue: string;
  inputError: string;

  // Actions
  setTempKey: (key: string) => void;
  setTempValue: (value: string) => void;
  clearInputError: () => void;

  // Validation
  validateAndGetParameter: (
    existingKeys: string[],
  ) => SourcecodeParameterType | null;

  // Reset
  resetForm: () => void;
}

// ===== 훅 =====

/**
 * 소스코드 파라미터 폼 임시 입력 상태 관리 훅
 *
 * 파라미터를 추가하기 전 임시 입력 상태와 검증 로직을 관리합니다.
 */
export function useSourcecodeParameterForm(): UseSourcecodeParameterFormReturn {
  const [tempKey, setTempKeyState] = useState("");
  const [tempValue, setTempValueState] = useState("");
  const [inputError, setInputError] = useState("");

  const clearInputError = () => setInputError("");

  const setTempKey = (key: string) => {
    setTempKeyState(key);
    clearInputError();
  };

  const setTempValue = (value: string) => {
    setTempValueState(value);
    clearInputError();
  };

  /**
   * 입력값 검증 및 파라미터 반환
   * @param existingKeys - 기존 파라미터 키 배열 (중복 검사용)
   * @returns 검증된 파라미터 또는 null (검증 실패 시)
   */
  const validateAndGetParameter = (
    existingKeys: string[],
  ): SourcecodeParameterType | null => {
    const trimmedKey = tempKey.trim();
    const trimmedValue = tempValue.trim();

    // 빈 값 검증
    if (!trimmedKey) {
      setInputError("파라미터 키를 입력해 주세요.");
      return null;
    }

    if (!trimmedValue) {
      setInputError("파라미터 값을 입력해 주세요.");
      return null;
    }

    // 중복 키 검증
    if (existingKeys.includes(trimmedKey)) {
      setInputError("이미 존재하는 키입니다.");
      return null;
    }

    clearInputError();
    return { key: trimmedKey, value: trimmedValue };
  };

  /**
   * 임시 입력 상태 초기화
   */
  const resetForm = () => {
    setTempKeyState("");
    setTempValueState("");
    clearInputError();
  };

  return {
    // State
    tempKey,
    tempValue,
    inputError,

    // Actions
    setTempKey,
    setTempValue,
    clearInputError,

    // Validation
    validateAndGetParameter,

    // Reset
    resetForm,
  };
}
