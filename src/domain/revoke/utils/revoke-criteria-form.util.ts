import { isString } from "es-toolkit";

import type { ReclaimPolicyJobType } from "@/domain/revoke/constants/revoke-criteria.constant";

/**
 * 폼 필드 ID 생성 유틸리티
 */
export const createFieldId = (
  jobType: ReclaimPolicyJobType,
  fieldName: string,
) => `${jobType.toLowerCase()}-${fieldName}`;

/**
 * 숫자 입력 onChange 핸들러 생성
 * null/undefined 및 유효하지 않은 숫자(NaN, Infinity)를 기본값으로 변환
 */
export const createNumberChangeHandler = (
  onChange: (value: number) => void,
  defaultValue: number,
) => {
  return (value: number | string | null) => {
    const numValue = isString(value)
      ? parseFloat(value)
      : (value ?? defaultValue);
    onChange(Number.isFinite(numValue) ? numValue : defaultValue);
  };
};
