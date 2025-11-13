import { format, startOfDay } from "date-fns";
import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const alertPageAtom = atomWithReset<number>(1);
// 검색 필터 - 시작 날짜 (금일 00시)
export const alertStartDateAtom = atom<string>(
  format(startOfDay(new Date()), "yyyy-MM-dd HH:mm:ss"),
);
// 검색 필터 - 종료 날짜 (현재 시간)
export const alertEndDateAtom = atom<string>(
  format(new Date(), "yyyy-MM-dd HH:mm:ss"),
);
// 체크된 알림 목록
export const alertCheckedListAtom = atomWithReset<Set<string>>(new Set());
// 선택된 알림
export const alertSelectedAtom = atom<string | null>(null);
// 알림 삭제 모달 표시 여부
export const openDeleteAlertModalAtom = atom<boolean>(false);
