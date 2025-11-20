import { format, startOfDay } from "date-fns";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/** 알림 페이지 번호 */
export const notificationPageAtom = atomWithReset<number>(1);
/** 알림 시작 날짜 */
export const notificationStartDateAtom = atom<string>(
  format(startOfDay(new Date()), "yyyy-MM-dd HH:mm:ss"),
);
/** 알림 종료 날짜 */
export const notificationEndDateAtom = atom<string>(
  format(new Date(), "yyyy-MM-dd HH:mm:ss"),
);
/** 체크된 알림 목록 */
export const notificationCheckedListAtom = atomWithReset<Set<string>>(
  new Set(),
);
/** 선택된 알림 */
export const notificationSelectedAtom = atom<string | null>(null);
/** 알림 삭제 모달 표시 여부 */
export const openDeleteNotificationModalAtom = atom<boolean>(false);
