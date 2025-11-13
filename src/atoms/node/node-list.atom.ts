import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { MigGpu } from "@/types/node/node.interface";

// 검색 필터 - 페이지 번호만 관리
export const nodePageAtom = atomWithReset<number>(1);
// MPS 설정 모달 표시 여부
export const openUpdateMpsModalAtom = atom<boolean>(false);
// MIG 설정 모달 표시 여부
export const openUpdateMigModalAtom = atom<boolean>(false);
// MIG 설정 모달 내 GPU 종류
export const migGpuProductAtom = atom<string>("");
// MIG 설정 모달 내 GPU 목록
export const migGpusAtom = atom<MigGpu[]>([]);
// MIG 설정 모달 내 선택된 GPU 인덱스
export const selectedMigGpuIndexAtom = atom<number>(-1);
// MIG 설정 모달 내 선택된 개수
export const selectedMigCountAtom = atom<string>("DISABLED");
// MIG 설정 모달 내 선택된 Config ID
export const selectedMigConfigIdAtom = atom<number>(-1);
