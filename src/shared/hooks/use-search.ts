import type { WritableAtom } from "jotai";
import { useSetAtom } from "jotai";
import type { FormEvent } from "react";

/**
 * 검색을 위한 공통 커스텀 훅
 *
 * 폼 제출 시 검색어를 atom에 저장하는 기능을 제공합니다.
 *
 * @param searchAtom - 검색어를 저장할 Jotai atom
 * @returns 검색 이벤트 핸들러 함수
 */
export const useSearch = (searchAtom: WritableAtom<string, [string], void>) => {
  const setSearchText = useSetAtom(searchAtom);

  /**
   * 검색 이벤트 핸들러
   *
   * 폼 제출 시 검색어를 atom에 저장합니다.
   *
   * @param e - 폼 제출 이벤트 객체
   */
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;

    setSearchText(searchValue);
  };

  return { onSubmit };
};
