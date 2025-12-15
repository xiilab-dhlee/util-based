/**
 * 요일 옵션 목록
 */
export const WEEK_DAYS = [
  { key: "mon", label: "월" },
  { key: "tue", label: "화" },
  { key: "wed", label: "수" },
  { key: "thu", label: "목" },
  { key: "fri", label: "금" },
  { key: "sat", label: "토" },
  { key: "sun", label: "일" },
] as const;

/**
 * 요일 키 값 배열 (Zod enum 검증용)
 */
export const WEEK_DAY_KEYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

/**
 * 요일 키 타입 (상수에서 파생)
 */
export type WeekDayKey = (typeof WEEK_DAY_KEYS)[number];

/**
 * 요일 옵션 타입 (상수에서 파생)
 */
export type WeekDayOption = (typeof WEEK_DAYS)[number];

/**
 * 요일 키로 라벨 조회
 */
export const WEEK_DAY_LABEL_MAP: Record<WeekDayKey, string> = WEEK_DAYS.reduce(
  (acc, day) => {
    acc[day.key] = day.label;
    return acc;
  },
  {} as Record<WeekDayKey, string>,
);
