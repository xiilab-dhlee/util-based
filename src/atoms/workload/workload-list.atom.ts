import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

// 검색 필터 - 페이지 번호
export const workloadPageAtom = atomWithReset<number>(1);
// 검색 필터 - 검색어
export const workloadSearchTextAtom = atom<string>("");
// 검색 필터 - 잡타입
export const workloadJobTypeAtom = atom<string>("");
// 검색 필터 - 상태
export const workloadStatusAtom = atom<string>("");
