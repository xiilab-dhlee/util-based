/** 목록 페이지 크기 */
export const LIST_PAGE_SIZE = 20;
/** 카드 페이지 크기 */
export const CARD_PAGE_SIZE = 12;
/** 아이콘 컬럼 너비 */
export const ICON_COLUMN_WIDTH = 40;
/** 체크박스 컬럼 너비 */
export const CHECKBOX_COLUMN_WIDTH = 40;
/** 사용자 모드 루트 경로 */
export const USER_ROOT_PATH = "/user/monitoring";
/** 관리자 모드 루트 경로 */
export const ADMIN_ROOT_PATH = "/admin/monitoring";

/** 계정 권한 상수 */
export const ACCOUNT_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;
/** 계정 권한 타입 */
export type AccountRole = (typeof ACCOUNT_ROLES)[keyof typeof ACCOUNT_ROLES];

/** 공통 모달 모드 상수 */
export const MODAL_MODES = {
  CREATE: "create",
  UPDATE: "update",
} as const;
/** 공통 모달 모드 타입 */
export type ModalMode = (typeof MODAL_MODES)[keyof typeof MODAL_MODES];

/** 전체 옵션 */
export const ALL_OPTION = {
  label: "전체",
  value: "ALL",
} as const;
