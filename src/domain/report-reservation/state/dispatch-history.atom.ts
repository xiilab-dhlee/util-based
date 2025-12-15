import { atomWithReset } from "jotai/utils";

/**
 * 발송 내역 페이지 번호
 */
export const dispatchHistoryPageAtom = atomWithReset<number>(1);
