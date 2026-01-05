"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  hubPageAtom,
  hubSearchKeywordAtom,
  hubSearchTextAtom,
} from "@/domain/hub/state/hub.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface HubListFilterProps {
  total: number;
  loading: boolean;
}

export function HubListFilter({ total, loading }: HubListFilterProps) {
  const [searchKeyword, setSearchKeyword] = useAtom(hubSearchKeywordAtom);
  const setSearchText = useSetAtom(hubSearchTextAtom);
  const resetPage = useResetAtom(hubPageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value);
  };

  return (
    <MySearchFilter title="허브 목록" total={total}>
      <SearchInput
        disabled={loading}
        onSearch={handleSearch}
        value={searchKeyword}
        onChange={setSearchKeyword}
      />
    </MySearchFilter>
  );
}
