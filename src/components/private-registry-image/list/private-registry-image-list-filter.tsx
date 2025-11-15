"use client";

import { useAtomValue } from "jotai";

import {
  privateRegistryImagePageAtom,
  privateRegistryImageSearchTextAtom,
} from "@/atoms/private-registry-image/private-registry-image.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useSearch } from "@/hooks/common/use-search";
import { useGetPrivateRegistryImages } from "@/hooks/private-registry-image/use-get-private-registry-images";
import { MySearchFilter } from "@/layouts/common/search-filter";

/**
 * 내부 레지스트리 이미지 목록 페이지 상단 필터 컴포넌트
 *
 * 내부 레지스트리 이미지 목록 페이지에서 검색어를 필터링하는 기능을 제공합니다.
 *
 * @returns 내부 레지스트리 이미지 목록 페이지 상단 필터 컴포넌트
 */
export function PrivateRegistryImageListFilter() {
  const { onSubmit } = useSearch(privateRegistryImageSearchTextAtom);

  const page = useAtomValue(privateRegistryImagePageAtom);

  const searchText = useAtomValue(privateRegistryImageSearchTextAtom);

  const { data } = useGetPrivateRegistryImages({
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
