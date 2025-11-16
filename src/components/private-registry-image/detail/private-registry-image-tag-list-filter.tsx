"use client";

import { privateRegistryImageTagSearchTextAtom } from "@/atoms/private-registry-image/private-registry-image.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { useSearch } from "@/hooks/common/use-search";
import { MySearchFilter } from "@/layouts/common/search-filter";

/**
 * 내부 레지스트리 이미지 태그 목록 필터 컴포넌트
 *
 * 태그 검색을 위한 필터를 제공합니다.
 */
export function PrivateRegistryImageTagListFilter() {
  const { onSubmit } = useSearch(privateRegistryImageTagSearchTextAtom);

  return (
    <MySearchFilter title="태그 목록" total={0}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
