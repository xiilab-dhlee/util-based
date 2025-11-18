"use client";

import { useAtomValue } from "jotai";

import {
  requestImagePageAtom,
  requestImageSearchTextAtom,
} from "@/atoms/request-image.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useSearch } from "@/hooks/common/use-search";
import { useGetRequestImages } from "@/hooks/request-image/use-get-request-images";
import { MySearchFilter } from "@/layouts/common/search-filter";
import { RequestImageStatusSort } from "./request-image-status-sort";

/**
 * 이미지 요청 목록 페이지 상단 필터 컴포넌트
 *
 * 이미지 요청 목록 페이지에서 검색어 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @returns 이미지 요청 목록 페이지 상단 필터 컴포넌트
 */
export function RequestImageListFilter() {
  // 공통 검색 훅 사용
  const { onSubmit } = useSearch(requestImageSearchTextAtom);

  // 페이지 번호
  const page = useAtomValue(requestImagePageAtom);
  // 검색어
  const searchText = useAtomValue(requestImageSearchTextAtom);

  // 이미지 요청 목록 데이터 조회
  const { data } = useGetRequestImages({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <MySearchFilter title="이미지 사용 요청 목록" total={data?.totalSize}>
      <RequestImageStatusSort />
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
