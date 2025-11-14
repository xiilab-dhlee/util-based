import type { CoreThemeOption } from "@/types/common/core.model";
/** 목록 페이지 크기 */
export const LIST_PAGE_SIZE = 20;
/** 아이콘 컬럼 너비 */
export const ICON_COLUMN_WIDTH = 40;
/** 체크박스 컬럼 너비 */
export const CHECKBOX_COLUMN_WIDTH = 40;
/** 전체 옵션 */
export const ALL_OPTION = {
  label: "전체",
  value: "ALL",
  icon: "Entire",
};
/** 기본 테마 옵션 */
export const THEME_OPTIONS: CoreThemeOption[] = [
  {
    key: "theme-primary",
    name: "기본 테마 1",
    previewClass: "theme-primary",
  },
  {
    key: "theme-secondary",
    name: "기본 테마 2",
    previewClass: "theme-secondary",
  },
  {
    key: "theme-tertiary",
    name: "기본 테마 3",
    previewClass: "theme-tertiary",
  },
  {
    key: "theme-quaternary",
    name: "기본 테마 4",
    previewClass: "theme-quaternary",
  },
  {
    key: "theme-quinary",
    name: "기본 테마 5",
    previewClass: "theme-quinary",
  },
  {
    key: "theme-senary",
    name: "기본 테마 6",
    previewClass: "theme-senary",
  },
];
