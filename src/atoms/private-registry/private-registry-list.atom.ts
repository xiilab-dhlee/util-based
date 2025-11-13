import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";

import type { GetPrivateRegistryImagesPayload } from "@/types/private-registry/private-registry.interface";

/**
 * 내부 레지스트리 목록 페이지 상태
 */
export interface PrivateRegistryListState {
  /** 검색어 */
  searchText: string;
  /** 상태 필터 */
  status?: "RUNNING" | "SUCCESSED";
  /** 정렬 순서 */
  sortOrder?: "latest" | "oldest" | "name";
  /** 현재 페이지 */
  page: number;
  /** 페이지당 아이템 수 */
  size: number;
}

/** 내부 레지스트리 목록 상태 초기값 */
const initialState: PrivateRegistryListState = {
  searchText: "",
  status: undefined,
  sortOrder: "latest",
  page: 1,
  size: 20,
};

/**
 * 내부 레지스트리 목록 전역 상태 관리 atom
 */
export const privateRegistryListAtom =
  atomWithReset<PrivateRegistryListState>(initialState);

/**
 * 내부 레지스트리 검색 텍스트 atom
 */
export const privateRegistrySearchTextAtom = atom<string>("");

/**
 * API 호출을 위한 payload를 생성하는 파생 atom
 */
export const privateRegistryListPayloadAtom =
  atom<GetPrivateRegistryImagesPayload>((get) => {
    const state = get(privateRegistryListAtom);

    return {
      searchText: state.searchText,
      page: state.page,
      size: state.size,
      // TODO: 필요에 따라 추가 필터 조건 적용
    };
  });

/**
 * 내부 레지스트리 목록 로딩 상태 atom
 */
export const privateRegistryListLoadingAtom = atom<boolean>(false);

/**
 * 내부 레지스트리 목록 선택된 아이템 atom
 */
export const privateRegistrySelectedItemsAtom = atom<React.Key[]>([]);
