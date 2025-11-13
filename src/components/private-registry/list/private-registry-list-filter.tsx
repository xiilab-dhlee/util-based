"use client";

import { privateRegistrySearchTextAtom } from "@/atoms/private-registry/private-registry-list.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { PRIVATE_REGISTRY_SAMPLE_RESPONSE } from "@/constants/private-registry/private-registry-sample.constant";
import { useSearch } from "@/hooks/common/use-search";
import { MySearchFilter } from "@/layouts/common/search-filter";
import PrivateRegistrySortOrder from "./private-registry-sort-order";
import PrivateRegistryStatusSort from "./private-registry-status-sort";

/**
 * 내부 레지스트리 목록 페이지 상단 필터 컴포넌트
 *
 * 내부 레지스트리 목록 페이지에서 검색어, 상태를 필터링하는 기능을 제공합니다.
 */
export function PrivateRegistryListFilter() {
  // 공통 검색 훅 사용
  const { onSubmit } = useSearch(privateRegistrySearchTextAtom);

  // TODO: API 연동 후 실제 총 개수로 변경
  const totalCount = PRIVATE_REGISTRY_SAMPLE_RESPONSE.total;

  return (
    <MySearchFilter title="컨테이너 이미지 목록" total={totalCount}>
      <PrivateRegistryStatusSort />
      <PrivateRegistrySortOrder />
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}

