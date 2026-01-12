"use client";

import { useSetAtom } from "jotai";
import { Input } from "xiilab-ui";

import { privateregistryImageTagSearchTextAtom } from "@/domain/private-registry/state/private-registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

/**
 * 프라이빗 레지스트리 이미지 태그 목록 필터 컴포넌트
 *
 * 태그 검색을 위한 필터를 제공합니다.
 */
export function PrivateRegistryTagListFilter() {
  const setSearchText = useSetAtom(privateregistryImageTagSearchTextAtom);

  const handleSearch = (value: string) => {
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="태그 목록" total={0}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
      />
    </MySearchFilter>
  );
}
