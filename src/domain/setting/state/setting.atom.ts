import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import {
  DEFAULT_SETTING_REQUEST_RESOURCE_SORT_STATE,
  type SettingRequestResourceSortField,
} from "@/domain/setting/constants/setting.constant";
import type { AntdTableSortState } from "@/shared/types/core.model";

/** 구성원 관리 검색 텍스트 */
export const settingMemberSearchTextAtom = atomWithReset<string>("");
/** 구성원 관리 페이지 번호 */
export const settingMemberPageAtom = atomWithReset<number>(1);
/** 리소스 요청 페이지 번호 */
export const settingRequestResourcePageAtom = atomWithReset<number>(1);
/** 리소스 요청 정렬 상태 */
export const settingRequestResourceSortAtom = atomWithReset<
  AntdTableSortState<SettingRequestResourceSortField>
>(DEFAULT_SETTING_REQUEST_RESOURCE_SORT_STATE);
/** 리소스 요청 생성 모달 표시 여부 */
export const openCreateResourceRequestModalAtom = atom<boolean>(false);
/** 리소스 요청 취소 모달 표시 여부 */
export const openCancelResourceRequestModalAtom = atom<boolean>(false);
/** 알림설정 모달 표시 여부 */
export const openUpdateNotificationSettingModalAtom = atom<boolean>(false);
/** 워크스페이스 구성원 추가 모달 표시 여부 */
export const openAddWorkspaceMemberModalAtom = atom<boolean>(false);

/** 워크스페이스 구성원 권한 수정 모달 표시 여부 */
export const openUpdateWorkspaceMemberRoleModalAtom = atom<boolean>(false);
/** 워크스페이스 구성원 삭제 모달 표시 여부 */
export const openDeleteWorkspaceMemberModalAtom = atom<boolean>(false);

/** 크리덴셜 삭제 모달 표시 여부 */
export const openDeleteCredentialModalAtom = atom<boolean>(false);
