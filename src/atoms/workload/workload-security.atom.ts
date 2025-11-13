import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const workloadSecurityPageAtom = atomWithReset<number>(1);
