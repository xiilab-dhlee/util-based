"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import { useGetInternalRegistryImages } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-images";
import {
  internalregistryImagePageAtom,
  internalregistryImageSearchTextAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 내부 레지스트리 이미지 목록 페이지 상단 필터 컴포넌트
 *
 * 내부 레지스트리 이미지 목록 페이지에서 검색어를 필터링하는 기능을 제공합니다.
 *
 * @returns 내부 레지스트리 이미지 목록 페이지 상단 필터 컴포넌트
 */
export function InternalRegistryImageListFilter() {
  const setSearchText = useSetAtom(internalregistryImageSearchTextAtom);
  const resetPage = useResetAtom(internalregistryImagePageAtom);
  const page = useAtomValue(internalregistryImagePageAtom);
  const searchText = useAtomValue(internalregistryImageSearchTextAtom);

  const { data } = useGetInternalRegistryImages({
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
    <MySearchFilter title="컨테이너 이미지 목록" total={data?.totalSize}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={(value) => handleSearch(value.trim())}
        autoComplete="off"
        width={220}
        height={30}
      />
    </MySearchFilter>
  );
}
