import type { DropdownOption } from "xiilab-ui";

/**
 * 리소스 회수 상세 타입 상수
 * - WARNING: 경고
 * - REVOKED: 회수
 */
export const REVOKE_HISTORY_DETAIL_TYPE = {
  WARNING: "WARNING",
  REVOKED: "REVOKED",
} as const;

/**
 * 리소스 회수 상세 타입 드롭다운 옵션
 */
export const REVOKE_HISTORY_TYPE_OPTIONS: DropdownOption[] = [
  { label: "경고", value: REVOKE_HISTORY_DETAIL_TYPE.WARNING },
  { label: "회수", value: REVOKE_HISTORY_DETAIL_TYPE.REVOKED },
];

/**
 * 리소스 회수 상세 타입 값 → 라벨 매핑
 * - DropdownOption 배열을 기반으로 한 번만 생성하여 재사용합니다.
 */
export const REVOKE_HISTORY_TYPE_LABEL_BY_VALUE =
  REVOKE_HISTORY_TYPE_OPTIONS.reduce<Record<string, string>>(
    (accumulator, option) => {
      const key = String(option.value);
      const label = String(option.label);
      accumulator[key] = label;
      return accumulator;
    },
    {},
  );

/**
 * 리소스 회수 기준 상수
 * - OR: OR 조건
 * - AND: AND 조건
 */
export const REVOKE_CRITERIA = {
  OR: "OR",
  AND: "AND",
} as const;

export type RevokeCriteria =
  (typeof REVOKE_CRITERIA)[keyof typeof REVOKE_CRITERIA];
