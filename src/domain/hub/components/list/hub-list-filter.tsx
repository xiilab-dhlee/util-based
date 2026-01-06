"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Input } from "xiilab-ui";

import {
  hubPageAtom,
  hubSearchKeywordAtom,
  hubSearchTextAtom,
} from "@/domain/hub/state/hub.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { SELECTOR } from "@/shared/constants/selector.constant";

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
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="허브 목록" total={total}>
      <Input.Search
        name="search"
        placeholder="허브 이름을 검색해 주세요."
        onSearch={handleSearch}
        onChange={(e) => setSearchKeyword(e.target.value)}
        autoComplete="off"
        width={220}
        height={30}
        disabled={loading}
        value={searchKeyword}
        data-testid={SELECTOR.LIST_SEARCH_INPUT}
      />
    </MySearchFilter>
  );
}
