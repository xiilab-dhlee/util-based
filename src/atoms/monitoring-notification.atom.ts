import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 모니터링 알림 페이지 번호 */
export const monitoringNotificationPageAtom = atomWithReset<number>(1);
/** 모니터링 알림 검색어 */
export const monitoringNotificationSearchTextAtom = atom<string>("");
/** 모니터링 알림 설정 모달 표시 여부 */
export const openManageMonitoringNotificationModalAtom = atom<boolean>(false);
/** 모니터링 알림 설정 상세 모달 표시 여부 */
export const openViewMonitoringNotificationModalAtom = atom<boolean>(false);
