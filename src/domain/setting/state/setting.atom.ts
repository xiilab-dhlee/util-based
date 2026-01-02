import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 리소스 요청 페이지 번호 */
export const settingRequestResourcePageAtom = atomWithReset<number>(1);
/** 리소스 요청 생성 모달 표시 여부 */
export const openCreateResourceRequestModalAtom = atom<boolean>(false);
/** 알림설정 모달 표시 여부 */
export const openUpdateNotificationSettingModalAtom = atom<boolean>(false);
/** 워크스페이스 구성원 추가 모달 표시 여부 */
export const openAddWorkspaceMemberModalAtom = atom<boolean>(false);
