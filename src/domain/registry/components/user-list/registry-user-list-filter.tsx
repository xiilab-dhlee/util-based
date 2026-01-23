"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  registryUserPageAtom,
  registryUserSearchTextAtom,
} from "@/domain/registry/state/registry-user-list.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface RegistryUserListFilterProps {
  totalSize?: number;
  loading: boolean;
}

export function RegistryUserListFilter({
  totalSize,
  loading,
}: RegistryUserListFilterProps) {
  const setSearchText = useSetAtom(registryUserSearchTextAtom);
  const resetPage = useResetAtom(registryUserPageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter
      title="사용자별 이미지 등록 현황"
      total={totalSize}
      totalCountTestId={SELECTOR.LIST_TOTAL_COUNT}
    >
      <Input.Search
        name="search"
        placeholder="사용자 이름을 검색해 주세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={240}
        height={30}
        disabled={loading}
        data-testid={SELECTOR.LIST_SEARCH_INPUT}
      />
    </MySearchFilter>
  );
}
