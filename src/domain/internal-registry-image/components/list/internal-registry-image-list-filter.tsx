"use client";

import { useAtomValue } from "jotai";

import { useGetInternalRegistryImages } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-images";
import {
  internalregistryImagePageAtom,
  internalregistryImageSearchTextAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useSearch } from "@/shared/hooks/use-search";

/**
 * 내부 레지스트리 이미지 목록 페이지 상단 필터 컴포넌트
 *
 * 내부 레지스트리 이미지 목록 페이지에서 검색어를 필터링하는 기능을 제공합니다.
 *
 * @returns 내부 레지스트리 이미지 목록 페이지 상단 필터 컴포넌트
 */
export function InternalRegistryImageListFilter() {
  const { onSubmit } = useSearch(internalregistryImageSearchTextAtom);

  const page = useAtomValue(internalregistryImagePageAtom);

  const searchText = useAtomValue(internalregistryImageSearchTextAtom);

  const { data } = useGetInternalRegistryImages({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <MySearchFilter title="컨테이너 이미지 목록" total={data?.totalSize}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
