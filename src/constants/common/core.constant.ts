import type {
  CoreBreadcrumbItem,
  CoreThemeOption,
} from "@/types/common/core.model";
/** 목록 페이지 크기 */
export const LIST_PAGE_SIZE = 20;
/** 카드 페이지 크기 */
export const CARD_PAGE_SIZE = 12;
/** 아이콘 컬럼 너비 */
export const ICON_COLUMN_WIDTH = 40;
/** 체크박스 컬럼 너비 */
export const CHECKBOX_COLUMN_WIDTH = 40;
/** 사용자 모드 루트 경로 */
export const STANDARD_ROOT_PATH = "/standard/dashboard";
/** 관리자 모드 루트 경로 */
export const ADMIN_ROOT_PATH = "/admin/monitoring";
/** 전체 옵션 */
export const ALL_OPTION = {
  label: "전체",
  value: "ALL",
  icon: "Entire",
};
/** 사용자 루트 브레드크럼 아이템 */
export const STANDARD_ROOT_BREADCRUMB_ITEM: CoreBreadcrumbItem = {
  title: "대시보드",
  icon: "Dashboard",
  href: "/standard/dashboard",
};
/** 관리자 루트 브레드크럼 아이템 */
export const ADMIN_ROOT_BREADCRUMB_ITEM: CoreBreadcrumbItem = {
  title: "모니터링",
  icon: "Monitoring01",
  href: "/admin/monitoring",
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
