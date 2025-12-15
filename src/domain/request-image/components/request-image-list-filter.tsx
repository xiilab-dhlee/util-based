"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import { useGetRequestImages } from "@/domain/request-image/hooks/use-get-request-images";
import {
  requestImagePageAtom,
  requestImageSearchTextAtom,
} from "@/domain/request-image/state/request-image.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { RequestImageStatusSort } from "./request-image-status-sort";

/**
 * 이미지 요청 목록 페이지 상단 필터 컴포넌트
 *
 * 이미지 요청 목록 페이지에서 검색어 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @returns 이미지 요청 목록 페이지 상단 필터 컴포넌트
 */
export function RequestImageListFilter() {
  const setSearchText = useSetAtom(requestImageSearchTextAtom);
  const resetPage = useResetAtom(requestImagePageAtom);
  const page = useAtomValue(requestImagePageAtom);
  const searchText = useAtomValue(requestImageSearchTextAtom);

  const { data } = useGetRequestImages({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  return (
    <MySearchFilter title="이미지 사용 요청 목록" total={data?.totalSize}>
      <RequestImageStatusSort />
      <SearchInput onSearch={handleSearch} />
    </MySearchFilter>
  );
}
