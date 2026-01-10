import { useCallback, useMemo, useState } from "react";
import type { DropdownOption } from "xiilab-ui";

type SelectValue = DropdownOption["value"];
type SelectOption<T extends SelectValue> = DropdownOption & { value: T };

const isValueInOptions = (
  value: SelectValue,
  options: readonly DropdownOption[],
): boolean => options.some((option) => option.value === value);

/**
 * Dropdown 컴포넌트를 위한 커스텀 훅
 *
 * @param initialValue - 초기 선택값 (null 또는 string)
 * @param options - 선택 가능한 옵션들
 * @param required - 필수 선택 여부
 * @returns 선택 상태와 관련 함수들을 포함한 객체
 */
export const useSelect = <T extends SelectValue = SelectValue>(
  initialValue: T | null = null,
  optionsInput: readonly DropdownOption[] = [],
  required: boolean = false,
) => {
  const [value, setValue] = useState<T | null>(initialValue);

  const options = useMemo(() => [...optionsInput], [optionsInput]);

  /**
   * 선택된 값을 설정하는 함수
   */
  const handleSetValue = useCallback(
    (newValue: SelectValue | null) => {
      if (newValue === null) {
        setValue(null);
        return;
      }

      const option = optionsInput.find(
        (opt): opt is SelectOption<T> => opt.value === newValue,
      );
      if (option) {
        setValue(option.value);
        return;
      }

      // options에 없는 값이 들어오는 경우 안전하게 null로 처리
      setValue(null);
    },
    [optionsInput],
  );

  /**
   * Dropdown의 onChange 핸들러
   */
  const onChange = handleSetValue;

  /**
   * 선택된 값을 초기값으로 리셋하는 함수
   */
  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  /**
   * 선택된 옵션의 라벨을 반환하는 함수
   */
  const selectedLabel = (() => {
    if (value === null) return "";
    const option = options.find((opt) => opt.value === value);
    return option?.label ?? "";
  })();

  /**
   * 선택된 옵션 객체를 반환하는 함수
   */
  const selectedOption =
    value === null
      ? null
      : (options.find((opt) => opt.value === value) ?? null);

  /**
   * 유효성 검사 함수
   */
  const isValid = (() => {
    if (!required) return true;
    if (value === null) return false;
    return isValueInOptions(value, options);
  })();

  /**
   * 에러 메시지
   */
  const errorMessage = required && !isValid ? "필수 선택 항목입니다." : "";

  /**
   * 선택된 값이 변경되었는지 확인하는 함수
   */
  const hasChanged = value !== initialValue;

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
