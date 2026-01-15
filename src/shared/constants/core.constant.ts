import type { DropdownOption } from "xiilab-ui";

import { ROUTES } from "@/shared/constants/routes.constant";

/** 목록 페이지 크기 */
export const LIST_PAGE_SIZE = 20;
/** 카드 페이지 크기 */
export const CARD_PAGE_SIZE = 12;
/** 아이콘 컬럼 너비 */
export const ICON_COLUMN_WIDTH = 40;
/** 체크박스 컬럼 너비 */
export const CHECKBOX_COLUMN_WIDTH = 40;
/** Aside 너비 */
export const ASIDE_WIDTH = 620;
/** 사용자 모드 루트 경로 */
export const USER_ROOT_PATH = ROUTES.USER_MONITORING;
/** 관리자 모드 루트 경로 */
export const ADMIN_ROOT_PATH = ROUTES.ADMIN_MONITORING;

/** 계정 권한 상수 */
export const ACCOUNT_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type AccountRole = (typeof ACCOUNT_ROLES)[keyof typeof ACCOUNT_ROLES];

export const ACCOUNT_ROLE_LABEL: Record<AccountRole, string> = {
  SUPER_ADMIN: "SUPER ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

/** 워크스페이스 멤버 역할 상수  */
export const WORKSPACE_MEMBER_ROLES = {
  OWNER: "OWNER",
  PARTICIPANT: "PARTICIPANT",
} as const;

/** 워크스페이스 멤버 역할 타입 */
export type WorkspaceMemberRole =
  (typeof WORKSPACE_MEMBER_ROLES)[keyof typeof WORKSPACE_MEMBER_ROLES];

/** 워크스페이스 멤버 역할 라벨 */
export const WORKSPACE_MEMBER_ROLE_LABEL: Record<WorkspaceMemberRole, string> =
  {
    OWNER: "Owner",
    PARTICIPANT: "Participant",
  } as const;

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
  value: "",
} as const;

/** ALL_OPTION.value 타입 */
export type AllOptionValue = typeof ALL_OPTION.value;

export const VISIBILITY_STATUS_OPTIONS: DropdownOption[] = [
  {
    label: "공개",
    value: "PUBLIC",
  },
  {
    label: "비공개",
    value: "PRIVATE",
  },
];

/** 노드 모드 값 */
export const NODE_MODE_VALUES = ["single", "multi"] as const;
/** 노드 모드 타입 */
export type NodeModeType = (typeof NODE_MODE_VALUES)[number];

/** 노드 모드 옵션 */
export const NODE_MODE_OPTIONS: DropdownOption[] = [
  { label: "Single", value: "single" },
  { label: "Multi", value: "multi" },
];

/** 테이블 메시지 상수 */
export const TABLE_MESSAGE = {
  /** API 에러 시 표시되는 메시지 */
  ERROR: "데이터를 불러올 수 없습니다.",
  /** 빈 목록일 때 표시되는 메시지 */
  EMPTY: "조회된 결과가 없습니다.",
} as const;
