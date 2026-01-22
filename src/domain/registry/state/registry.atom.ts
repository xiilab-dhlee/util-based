import { atomWithReset } from "jotai/utils";

import type { RegistryUserSortState } from "../constants/registry-user-list.constant";

/** 개인 레지스트리 페이지 번호 */
export const userPrivateRegistryPageAtom = atomWithReset<number>(1);
/** 개인 레지스트리 검색어 (검색 실행) */
export const userPrivateRegistrySearchTextAtom = atomWithReset<string>("");
/** 사용자 목록 정렬 상태 */
export const userPrivateRegistrySortAtom = atomWithReset<RegistryUserSortState>(
  {
    field: "accountName",
    order: "ascend",
  },
);

/** 이미지 사용 요청 대기 목록 페이지 번호 */
export const waitingRequestImagePageAtom = atomWithReset<number>(1);
/** 이미지 사용 요청 대기 목록 검색어 (검색 실행) */
export const waitingRequestImageSearchTextAtom = atomWithReset<string>("");
