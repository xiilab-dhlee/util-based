"use client";

import { useAtomValue } from "jotai";

import { useGetRequestImages } from "@/domain/request-image/hooks/use-get-request-images";
import {
  requestImagePageAtom,
  requestImageSearchTextAtom,
} from "@/domain/request-image/state/request-image.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useSearch } from "@/shared/hooks/use-search";
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
