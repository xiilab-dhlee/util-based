import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 구성원 관리 검색 텍스트 */
export const settingMemberSearchTextAtom = atom<string>("");
/** 구성원 관리 페이지 번호 */
export const settingMemberPageAtom = atomWithReset<number>(1);
/** 리소스 요청 페이지 번호 */
export const settingRequestResourcePageAtom = atomWithReset<number>(1);
/** 리소스 요청 생성 모달 표시 여부 */
export const openCreateResourceRequestModalAtom = atom<boolean>(false);
/** 알림설정 모달 표시 여부 */
export const openUpdateNotificationSettingModalAtom = atom<boolean>(false);
