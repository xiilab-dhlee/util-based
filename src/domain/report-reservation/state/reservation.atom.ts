import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

/**
 * 예약 목록 페이지 번호
 */
export const reservationPageAtom = atomWithReset<number>(1);

/**
 * 예약발송 토글 confirm 모달 표시 여부
 */
export const openToggleScheduleConfirmModalAtom = atom<boolean>(false);

/**
 * 예약 삭제 모달 표시 여부
 */
export const openDeleteReservationModalAtom = atom<boolean>(false);
