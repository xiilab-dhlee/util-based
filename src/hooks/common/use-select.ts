import { useCallback, useMemo, useState } from "react";

import type { DropdownOption } from "xiilab-ui";

/**
 * Dropdown 컴포넌트를 위한 커스텀 훅
 *
 * @param initialValue - 초기 선택값 (null 또는 string)
 * @param options - 선택 가능한 옵션들
 * @param required - 필수 선택 여부
 * @returns 선택 상태와 관련 함수들을 포함한 객체
 */
export const useSelect = <T extends string = string>(
  initialValue: T | null = null,
  options: DropdownOption[] = [],
  required: boolean = false,
) => {
  const [value, setValue] = useState<T | null>(initialValue);

  /**
   * 선택된 값을 설정하는 함수
   */
  const handleSetValue = useCallback((newValue: string | null) => {
    setValue(newValue as T);
  }, []);

  /**
   * Dropdown의 onChange 핸들러
   */
  const onChange = useCallback((newValue: string | null) => {
    setValue(newValue as T);
  }, []);

  /**
   * 선택된 값을 초기값으로 리셋하는 함수
   */
  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  /**
   * 선택된 옵션의 라벨을 반환하는 함수
   */
  const selectedLabel = useMemo(() => {
    if (!value) return "";
    const option = options.find((opt) => opt.value === value);
    return option?.label || "";
  }, [value, options]);

  /**
   * 선택된 옵션 객체를 반환하는 함수
   */
  const selectedOption = useMemo(() => {
    if (!value) return null;
    return options.find((opt) => opt.value === value) || null;
  }, [value, options]);

  /**
   * 유효성 검사 함수
   */
  const isValid = useMemo(() => {
    if (required) {
      return value !== null && value !== undefined;
    }
    return true;
  }, [value, required]);

  /**
   * 에러 메시지
   */
  const errorMessage = useMemo(() => {
    if (required && !isValid) {
      return "필수 선택 항목입니다.";
    }
    return "";
  }, [required, isValid]);

  /**
   * 선택된 값이 변경되었는지 확인하는 함수
   */
  const hasChanged = useMemo(() => {
    return value !== initialValue;
  }, [value, initialValue]);

  return {
    // 상태
    value,
    selectedLabel,
    selectedOption,

    // 함수
    setValue: handleSetValue,
    onChange,
    resetValue,

    // 유효성
    isValid,
    errorMessage,
    hasChanged,

    // 옵션
    options,
  };
};
