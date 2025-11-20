import type { DropdownOption } from "xiilab-ui";

import type { CoreBreadcrumbItem } from "@/types/common/core.model";
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
export const ALL_OPTION: DropdownOption = {
  label: "전체",
  value: "ALL",
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
